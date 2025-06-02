import { SignupForm } from "@/components/signup-form"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth" 

export const metadata: Metadata = {
  title: "Sign Up - RYD Admin",
  description: "Create a new account for RYD Admin dashboard",
}

export default async function SignupPage() {
  const session = await auth()
  
  // If the user is already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard")
  }
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  )
} 