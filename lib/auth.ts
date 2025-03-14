"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple admin authentication without Supabase dependency
export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simple hardcoded check with the correct password
  if (password === "nosurprises") {
    // Set a simple cookie flag to indicate admin is logged in
    cookies().set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  }

  return { success: false, error: "Invalid password" }
}

// Check if user is authenticated
export async function isAuthenticated() {
  // Check if the admin-auth cookie exists
  return cookies().has("admin-auth")
}

// Logout
export async function adminLogout() {
  // Delete the admin-auth cookie
  cookies().delete("admin-auth")
  redirect("/admin/login")
}

