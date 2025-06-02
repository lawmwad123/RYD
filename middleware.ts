import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define route access rules
const routeAccess = {
  // Public routes (no authentication required)
  public: ["/", "/auth/signin", "/auth/signup", "/auth/error", "/auth/rejected", "/auth/suspended"],
  
  // Admin-only routes
  admin: [
    "/admin",
    "/admin/users",
    "/admin/users/approve",
    "/admin/users/manage",
    "/admin/settings",
    "/admin/reports",
    "/admin/finance",
  ],
  
  // Staff and above routes
  staff: [
    "/dashboard/projects",
    "/dashboard/tasks/create",
    "/dashboard/reports",
    "/dashboard/team",
  ],
  
  // All authenticated users (including volunteers)
  authenticated: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/tasks",
    "/dashboard/documents",
    "/dashboard/checkin",
  ],
  
  // Pending users (limited access)
  pending: [
    "/pending-approval",
    "/pending-approval/profile",
    "/dashboard/profile",
    "/dashboard/pending",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Create response with Chrome-compatible headers
  const response = NextResponse.next();
  
  // Add Chrome-specific headers for better authentication handling
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  
  // Allow public routes
  if (routeAccess.public.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Get the token from the request with Chrome-compatible options
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });

  // Redirect unauthenticated users to signin
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const userRole = token.role as string;
  const userStatus = token.status as string;

  // Handle pending users - redirect to pending approval page
  if (userStatus === "PENDING") {
    // Allow access to pending approval routes
    if (routeAccess.pending.some(route => pathname.startsWith(route))) {
      return response;
    }
    
    // Redirect to pending approval page if trying to access other routes
    if (!pathname.startsWith("/pending-approval")) {
      return NextResponse.redirect(new URL("/pending-approval", req.url));
    }
    
    return response;
  }

  // Handle rejected users
  if (userStatus === "REJECTED") {
    // Allow access to rejected page only
    if (pathname === "/auth/rejected") {
      return response;
    }
    return NextResponse.redirect(new URL("/auth/rejected", req.url));
  }

  // Handle suspended or inactive users
  if (userStatus === "SUSPENDED" || userStatus === "INACTIVE") {
    // Allow access to suspended page only
    if (pathname === "/auth/suspended") {
      return response;
    }
    return NextResponse.redirect(new URL("/auth/suspended", req.url));
  }

  // Redirect approved users away from pending approval pages
  if (userStatus === "ACTIVE" && pathname.startsWith("/pending-approval")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check admin routes
  if (routeAccess.admin.some(route => pathname.startsWith(route))) {
    if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Check staff routes
  if (routeAccess.staff.some(route => pathname.startsWith(route))) {
    if (userRole === "VOLUNTEER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Allow access to authenticated routes for active users
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 