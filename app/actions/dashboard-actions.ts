"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function verifyEmail(email: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("email").eq("email", email).maybeSingle()

    if (error) {
      console.error("Error verifying email:", error)
      throw new Error("Failed to verify email")
    }

    return { exists: !!data }
  } catch (error) {
    console.error("Error in verifyEmail:", error)
    throw error
  }
}
