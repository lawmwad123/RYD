import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@/lib/generated/prisma";
import { comparePasswords } from "@/lib/server/bcrypt";
import { NextAuthConfig } from "next-auth";
import { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { UserRole, UserStatus } from "@/lib/generated/prisma";

// Extend the next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    status: UserStatus;
    lastRefresh?: number;
  }
}

// Determine environment settings
const useSecureCookie = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const isVercel = !!process.env.VERCEL;
const isLocalhost = process.env.NEXTAUTH_URL?.includes("localhost") || process.env.AUTH_URL?.includes("localhost") || !process.env.VERCEL;

// For CSRF handling, treat localhost as development even in production builds
const isLocalDevelopment = isDevelopment || isLocalhost;

// Get the correct URL for production/development
const getAuthUrl = () => {
  if (isDevelopment) return "http://localhost:3000";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "http://localhost:3000";
};

// Configure authentication with proper production settings
export const authConfig: NextAuthConfig = {
  debug: process.env.NEXTAUTH_DEBUG === "true",
  basePath: "/api/auth",
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Important: Trust host in production for Vercel
  trustHost: true,
  
  // Use AUTH_SECRET instead of NEXTAUTH_SECRET in production
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  
  // Enable advanced features for production
  experimental: {
    enableWebAuthn: false,
  },
  
  // Configure for production CSRF handling
  useSecureCookies: useSecureCookie,
  
  logger: {
    error(error: Error) {
      // Handle CSRF errors more gracefully
      if (error.message?.includes("CSRF")) {
        if (isLocalDevelopment) {
          console.log("[Auth] CSRF error ignored in local development mode (including localhost production builds)");
          return;
        } else {
          console.error("[Auth] CSRF error in production:", error.message);
          console.error("[Auth] This usually indicates:");
          console.error("  - Missing CSRF token in the request");
          console.error("  - Incorrect cookie configuration");
          console.error("  - Cross-domain cookie issues");
          console.error("  - Missing or incorrect AUTH_SECRET");
        }
      } else {
        console.error(`[Auth] Error:`, error);
      }
    },
    warn(code: any) {
      console.warn(`[Auth] Warning:`, code);
    },
    debug(code: any) {
      if (process.env.NEXTAUTH_DEBUG === "true") {
        console.log(`[Auth] Debug:`, code);
      }
    },
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookie ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: (useSecureCookie && !isLocalhost) ? "none" : "lax", // Use "lax" for localhost even in production
        path: "/",
        secure: useSecureCookie && !isLocalhost, // Don't require HTTPS for localhost
        domain: isVercel && useSecureCookie ? `.${process.env.VERCEL_URL?.replace('https://', '')}` : undefined,
      },
    },
    callbackUrl: {
      name: `${useSecureCookie ? "__Secure-" : ""}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: (useSecureCookie && !isLocalhost) ? "none" : "lax",
        path: "/",
        secure: useSecureCookie && !isLocalhost,
        domain: isVercel && useSecureCookie ? `.${process.env.VERCEL_URL?.replace('https://', '')}` : undefined,
      },
    },
    csrfToken: {
      name: `${useSecureCookie ? "__Secure-" : ""}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: (useSecureCookie && !isLocalhost) ? "none" : "lax",
        path: "/",
        secure: useSecureCookie && !isLocalhost,
        domain: isVercel && useSecureCookie ? `.${process.env.VERCEL_URL?.replace('https://', '')}` : undefined,
      },
    },
    state: {
      name: `${useSecureCookie ? "__Secure-" : ""}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: (useSecureCookie && !isLocalhost) ? "none" : "lax",
        path: "/",
        secure: useSecureCookie && !isLocalhost,
        maxAge: 15 * 60, // 15 minutes
        domain: isVercel && useSecureCookie ? `.${process.env.VERCEL_URL?.replace('https://', '')}` : undefined,
      },
    },
    pkceCodeVerifier: {
      name: `${useSecureCookie ? "__Secure-" : ""}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: (useSecureCookie && !isLocalhost) ? "none" : "lax",
        path: "/",
        secure: useSecureCookie && !isLocalhost,
        maxAge: 15 * 60, // 15 minutes
        domain: isVercel && useSecureCookie ? `.${process.env.VERCEL_URL?.replace('https://', '')}` : undefined,
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Include user role and status in the JWT token when it's available
      if (user) {
        console.log("[Auth] JWT callback - user:", user.email);
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.email = user.email;
        token.name = user.name;
        token.lastRefresh = Date.now();
      }
      
      // For debugging
      if (account) {
        console.log("[Auth] JWT callback - account provider:", account.provider);
      }
      
      // Refresh user data from database every 5 minutes or on update trigger
      const shouldRefresh = 
        trigger === 'update' || 
        !token.lastRefresh || 
        Date.now() - (token.lastRefresh as number) > 5 * 60 * 1000; // 5 minutes
      
      if (shouldRefresh && token.id) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              name: true,
              role: true,
              status: true,
            }
          });
          
          if (freshUser) {
            token.id = freshUser.id;
            token.email = freshUser.email;
            token.role = freshUser.role;
            token.status = freshUser.status;
            token.name = freshUser.name || `${freshUser.firstName || ''} ${freshUser.lastName || ''}`.trim() || freshUser.email;
            token.lastRefresh = Date.now();
            console.log("[Auth] JWT token refreshed with latest user data:", freshUser.email, "status:", freshUser.status);
          }
        } catch (error) {
          console.error("[Auth] Failed to refresh user data:", error);
        }
      }
      
      console.log("[Auth] JWT token generated:", token.email, "with role:", token.role, "and status:", token.status);
      return token;
    },
    async session({ session, token }) {
      // Make ID, role, and status available on the client-side
      if (session.user && token) {
        console.log("[Auth] Session callback - setting user data from token");
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.email = token.email as string;
        session.user.name = token.name as string || "User";
      }
      
      console.log("[Auth] Session created/updated:", session?.user?.email, "status:", session?.user?.status);
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // In local development (including localhost production builds), always allow sign in to bypass CSRF checks
      if (isLocalDevelopment) {
        console.log("[Auth] Sign in callback - allowing authentication in local development mode");
        return true;
      }
      
      // In production, perform proper validation
      console.log("[Auth] Sign in callback - validating authentication in production mode");
      
      // Allow OAuth providers (they handle CSRF internally)
      if (account?.provider && account.provider !== 'credentials') {
        console.log("[Auth] OAuth sign in allowed for provider:", account.provider);
        return true;
      }
      
      // For credentials, ensure we have a valid user
      if (account?.provider === 'credentials' && user) {
        console.log("[Auth] Credentials sign in allowed for user:", user.email);
        return true;
      }
      
      console.log("[Auth] Sign in denied - invalid authentication attempt");
      return false;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isOnLogin = nextUrl.pathname === "/login";
      const userStatus = auth?.user?.status;
      const userRole = auth?.user?.role;
      
      console.log("[Auth] Authorized check:", { 
        isLoggedIn, 
        path: nextUrl.pathname, 
        userStatus,
        userRole,
        userEmail: auth?.user?.email
      });
      
      // First check: Must be logged in for protected routes
      if (isOnDashboard || isOnAdmin) {
        if (!isLoggedIn) {
          console.log("[Auth] Unauthorized access, redirecting to signin");
          return false; // Redirect unauthenticated users to signin page
        }
        
        // Ensure we have complete user data from the JWT token
        if (!userStatus || !userRole) {
          console.log("[Auth] Incomplete user data in token, denying access");
          return false;
        }
        
        // Second check: User status must allow access
        if (userStatus === 'SUSPENDED' || userStatus === 'INACTIVE') {
          console.log("[Auth] Suspended/inactive user attempting dashboard access, blocking");
          return Response.redirect(new URL("/auth/suspended", nextUrl));
        }
        
        if (userStatus === 'REJECTED') {
          console.log("[Auth] Rejected user attempting dashboard access, blocking");
          return Response.redirect(new URL("/auth/rejected", nextUrl));
        }
        
        if (userStatus === 'PENDING' && isOnDashboard) {
          console.log("[Auth] Pending user attempting dashboard access, redirecting to pending approval");
          return Response.redirect(new URL("/pending-approval", nextUrl));
        }
        
        // Allow access for ACTIVE users
        if (userStatus === 'ACTIVE') {
          console.log("[Auth] Active user granted access to:", nextUrl.pathname);
          return true;
        }
        
        // Block access if status is unknown or invalid
        console.log("[Auth] User with invalid status attempting access:", userStatus);
        return false;
      } 
      // Prevent redirect loops for already logged in users
      else if (isLoggedIn && (isOnLogin || nextUrl.pathname === "/auth/signin")) {
        console.log("[Auth] User already logged in, checking where to redirect");
        
        // Redirect based on user status
        if (userStatus === 'PENDING') {
          console.log("[Auth] Redirecting pending user to pending approval");
          return Response.redirect(new URL("/pending-approval", nextUrl));
        } else if (userStatus === 'ACTIVE') {
          console.log("[Auth] Redirecting active user to dashboard");
          return Response.redirect(new URL("/dashboard", nextUrl));
        } else if (userStatus === 'SUSPENDED' || userStatus === 'INACTIVE') {
          console.log("[Auth] Redirecting suspended user to suspended page");
          return Response.redirect(new URL("/auth/suspended", nextUrl));
        } else if (userStatus === 'REJECTED') {
          console.log("[Auth] Redirecting rejected user to rejected page");
          return Response.redirect(new URL("/auth/rejected", nextUrl));
        }
        
        // Default fallback
        console.log("[Auth] Fallback redirect to dashboard");
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      
      // Allow all other requests
      return true;
    },
    // Improved redirect callback to prevent loops
    redirect({ url, baseUrl }) {
      console.log("[Auth] Redirect callback:", { url, baseUrl });
      
      // Handle relative URLs
      if (url.startsWith("/")) {
        const fullUrl = `${baseUrl}${url}`;
        console.log("[Auth] Redirecting to relative URL:", fullUrl);
        return fullUrl;
      }
      
      // Handle absolute URLs - only allow same origin
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        if (urlObj.origin === baseUrlObj.origin) {
          console.log("[Auth] Redirecting to same-origin URL:", url);
          return url;
        }
      } catch (error) {
        console.log("[Auth] Invalid URL format:", url);
      }
      
      // Default to base URL
      console.log("[Auth] Redirecting to base URL:", baseUrl);
      return baseUrl;
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

        try {
          console.log(`Attempting login for email: ${email}`);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            console.log("User not found or no password set");
            return null;
          }

          const isPasswordValid = await comparePasswords(
            password,
            user.password
          );

          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }

          console.log(`Login successful for user: ${user.email} with role: ${user.role}`);
          
          // Return user object that will be passed to JWT callback
          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName} ${user.lastName}`.trim() || user.email,
            role: user.role,
            status: user.status,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  events: {
    async signIn(message) {
      console.log("[Auth] User signed in:", message.user.email);
    },
    async signOut(message) {
      console.log("[Auth] User signed out");
    },
    async createUser(message) {
      console.log("[Auth] User created:", message.user.email);
    },
    async linkAccount(message) {
      console.log("[Auth] Account linked:", message.account.provider);
    },
    async session(message) {
      console.log("[Auth] Session accessed:", message.session.user?.email);
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Enhanced auth function that ensures complete user data
export async function getServerSession() {
  const session = await auth();
  
  if (!session?.user?.id) {
    console.log("[Auth] No session or user ID found");
    return null;
  }
  
  // If we have incomplete user data, fetch from database
  if (!session.user.role || !session.user.status) {
    console.log("[Auth] Incomplete user data, fetching from database");
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          name: true,
          role: true,
          status: true,
        }
      });
      
      if (user) {
        // Update session with complete user data
        session.user.role = user.role;
        session.user.status = user.status;
        session.user.name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        session.user.email = user.email;
        console.log("[Auth] Updated session with complete user data:", user.email, "role:", user.role, "status:", user.status);
      }
    } catch (error) {
      console.error("[Auth] Failed to fetch complete user data:", error);
    }
  }
  
  return session;
} 