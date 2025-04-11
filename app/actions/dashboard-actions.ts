"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { hashEmail } from "@/lib/hash-utils"

export async function verifyEmail(email: string) {
  try {
    const supabase = createServerSupabaseClient()
    const hashedEmail = hashEmail(email)

    const { data, error } = await supabase.from("submissions").select("email").eq("email", hashedEmail).maybeSingle()
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
