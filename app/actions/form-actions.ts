"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// Define the type for the form data
type FormData = {
  email: string
  university: string
  other_university?: string
  sevis_terminated: string
  sevis_termination_date: string | null
  sevis_notification_method?: string
  visa_revoked: string
  visa_revocation_date: string | null
  status_at_incident: string
  academic_level?: string
  termination_reason?: string[]
  termination_reason_other?: string
  linked_to_law_enforcement?: string
  incident_type?: string
  was_arrested?: string
  was_fingerprinted?: string
  legal_case_status?: string
  h1b_status?: string
  legal_consultation?: string
  immediate_plans?: string[]
  consent_to_share: boolean
}

// Check if email already exists in the database
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("email").eq("email", email).maybeSingle()

    if (error) {
      console.error("Error checking email:", error)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error in checkEmailExists:", error)
    return false
  }
}

// Update the submitFormData function to handle the other_university field correctly

export async function submitFormData(formData: FormData, overwrite = false) {
  try {
    const supabase = createServerSupabaseClient()

    if (overwrite) {
      // Delete existing record with the same email
      await supabase.from("submissions").delete().eq("email", formData.email)
    }

    // Create a new object without the other_university field
    const { other_university, ...dataToSubmit } = formData

    // If university is "Other", use the other_university value
    if (formData.university === "Other" && formData.other_university) {
      dataToSubmit.university = formData.other_university
    }

    // Insert the form data into the submissions table
    const { error } = await supabase.from("submissions").insert([dataToSubmit])

    if (error) {
      console.error("Error submitting form data:", error)
      throw new Error("Failed to submit form data")
    }

    return { success: true }
  } catch (error) {
    console.error("Error in submitFormData:", error)
    throw error
  }
}

// Update the getSubmissionsStats function to handle empty results
export async function getSubmissionsStats() {
  try {
    const supabase = createServerSupabaseClient()

    // Get total submissions
    const { count: totalSubmissions, error: countError } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error getting submission count:", countError)
      return {
        totalSubmissions: 0,
        sevisTerminated: 0,
        visaRevoked: 0,
      }
    }

    // Get SEVIS termination count
    const { data: sevisTerminated, error: sevisError } = await supabase
      .from("submissions")
      .select("count")
      .eq("sevis_terminated", "Yes")

    if (sevisError) {
      console.error("Error getting SEVIS termination count:", sevisError)
      return {
        totalSubmissions: totalSubmissions || 0,
        sevisTerminated: 0,
        visaRevoked: 0,
      }
    }

    // Get visa revocation count
    const { data: visaRevoked, error: visaError } = await supabase
      .from("submissions")
      .select("count")
      .eq("visa_revoked", "Yes")

    if (visaError) {
      console.error("Error getting visa revocation count:", visaError)
      return {
        totalSubmissions: totalSubmissions || 0,
        sevisTerminated: sevisTerminated?.[0]?.count || 0,
        visaRevoked: 0,
      }
    }

    return {
      totalSubmissions: totalSubmissions || 0,
      sevisTerminated: sevisTerminated?.[0]?.count || 0,
      visaRevoked: visaRevoked?.[0]?.count || 0,
    }
  } catch (error) {
    console.error("Error in getSubmissionsStats:", error)
    // Return default values if there's an error
    return {
      totalSubmissions: 0,
      sevisTerminated: 0,
      visaRevoked: 0,
    }
  }
}

// Update the getUniversityDistribution function to handle empty results
export async function getUniversityDistribution() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("university").order("university")

    if (error) {
      console.error("Error getting university distribution:", error)
      throw new Error("Failed to get university distribution")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each university
    const universityCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.university) {
        universityCounts[item.university] = (universityCounts[item.university] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const universityDistribution = Object.entries(universityCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return universityDistribution
  } catch (error) {
    console.error("Error in getUniversityDistribution:", error)
    return [] // Return empty array if there's an error
  }
}

// Update the getStatusDistribution function to handle empty results
export async function getStatusDistribution() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("status_at_incident").order("status_at_incident")

    if (error) {
      console.error("Error getting status distribution:", error)
      throw new Error("Failed to get status distribution")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each status
    const statusCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.status_at_incident) {
        statusCounts[item.status_at_incident] = (statusCounts[item.status_at_incident] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const statusDistribution = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return statusDistribution
  } catch (error) {
    console.error("Error in getStatusDistribution:", error)
    return [] // Return empty array if there's an error
  }
}

// Update the getTerminationReasonDistribution function to handle empty results
export async function getTerminationReasonDistribution() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("termination_reason")
      .not("termination_reason", "is", null)

    if (error) {
      console.error("Error getting termination reason distribution:", error)
      throw new Error("Failed to get termination reason distribution")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each reason (flattening the arrays)
    const reasonCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.termination_reason && Array.isArray(item.termination_reason)) {
        item.termination_reason.forEach((reason) => {
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1
        })
      }
    })

    // Convert to array of objects for charting
    const reasonDistribution = Object.entries(reasonCounts).map(([id, count]) => {
      // Map the ID to a readable label
      let name = id
      switch (id) {
        case "ina-237-a-1-c-i":
          name = "INA 237(a)(1)(C)(i) (Failure to maintain status)"
          break
        case "ina-237-a-4-c-i":
          name = "INA 237(a)(4)(C)(i) (Foreign policy consequences)"
          break
        case "criminal-records-check":
          name = "Criminal Records Check"
          break
        case "specific-criminal-activity":
          name = "Specific Criminal Activity"
          break
        case "protest-speech-activity":
          name = "Protest/Speech Activity"
          break
        case "opt-cpt-violation":
          name = "OPT/CPT Violation"
          break
        case "reason-unclear":
          name = "Reason Unclear"
          break
        case "other":
          name = "Other"
          break
        case "no-termination":
          name = "No Termination Yet"
          break
      }
      return { name, count }
    })

    return reasonDistribution
  } catch (error) {
    console.error("Error in getTerminationReasonDistribution:", error)
    return [] // Return empty array if there's an error
  }
}

// Update the getTimelineData function to handle empty results
export async function getTimelineData() {
  try {
    const supabase = createServerSupabaseClient()

    // Get SEVIS termination dates
    const { data: sevisData, error: sevisError } = await supabase
      .from("submissions")
      .select("sevis_termination_date")
      .not("sevis_termination_date", "is", null)
      .order("sevis_termination_date")

    if (sevisError) {
      console.error("Error getting SEVIS termination dates:", sevisError)
      throw new Error("Failed to get SEVIS termination dates")
    }

    // Get visa revocation dates
    const { data: visaData, error: visaError } = await supabase
      .from("submissions")
      .select("visa_revocation_date")
      .not("visa_revocation_date", "is", null)
      .order("visa_revocation_date")

    if (visaError) {
      console.error("Error getting visa revocation dates:", visaError)
      throw new Error("Failed to get visa revocation dates")
    }

    // Handle empty data
    if ((!sevisData || sevisData.length === 0) && (!visaData || visaData.length === 0)) {
      return []
    }

    // Group by month
    const monthCounts: Record<string, { sevis: number; visa: number }> = {}

    // Process SEVIS termination dates
    if (sevisData && sevisData.length > 0) {
      sevisData.forEach((item) => {
        if (item.sevis_termination_date) {
          const date = new Date(item.sevis_termination_date)
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

          if (!monthCounts[monthYear]) {
            monthCounts[monthYear] = { sevis: 0, visa: 0 }
          }

          monthCounts[monthYear].sevis += 1
        }
      })
    }

    // Process visa revocation dates
    if (visaData && visaData.length > 0) {
      visaData.forEach((item) => {
        if (item.visa_revocation_date) {
          const date = new Date(item.visa_revocation_date)
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

          if (!monthCounts[monthYear]) {
            monthCounts[monthYear] = { sevis: 0, visa: 0 }
          }

          monthCounts[monthYear].visa += 1
        }
      })
    }

    // Convert to array and sort by date
    const timelineData = Object.entries(monthCounts)
      .map(([monthYear, counts]) => {
        const [year, month] = monthYear.split("-")
        const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
        const name = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })

        return {
          name,
          sevis: counts.sevis,
          visa: counts.visa,
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.name)
        const dateB = new Date(b.name)
        return dateA.getTime() - dateB.getTime()
      })

    return timelineData
  } catch (error) {
    console.error("Error in getTimelineData:", error)
    return [] // Return empty array if there's an error
  }
}

// Update the getLawEnforcementData function to handle empty results
export async function getLawEnforcementData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("linked_to_law_enforcement")
      .not("linked_to_law_enforcement", "is", null)

    if (error) {
      console.error("Error getting law enforcement data:", error)
      throw new Error("Failed to get law enforcement data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return [
        { name: "Yes", count: 0 },
        { name: "No", count: 0 },
        { name: "Unsure", count: 0 },
        { name: "Prefer not to say", count: 0 },
      ]
    }

    // Count occurrences of each response
    const responseCounts: Record<string, number> = {
      Yes: 0,
      No: 0,
      Unsure: 0,
      "Prefer not to say": 0,
    }

    data.forEach((item) => {
      if (item.linked_to_law_enforcement) {
        responseCounts[item.linked_to_law_enforcement] += 1
      }
    })

    // Convert to array of objects for charting
    const lawEnforcementData = Object.entries(responseCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return lawEnforcementData
  } catch (error) {
    console.error("Error in getLawEnforcementData:", error)
    return [
      { name: "Yes", count: 0 },
      { name: "No", count: 0 },
      { name: "Unsure", count: 0 },
      { name: "Prefer not to say", count: 0 },
    ]
  }
}

// Update the getLegalConsultationData function to handle empty results
export async function getLegalConsultationData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("legal_consultation")
      .not("legal_consultation", "is", null)

    if (error) {
      console.error("Error getting legal consultation data:", error)
      throw new Error("Failed to get legal consultation data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return [
        { name: "Yes", count: 0 },
        { name: "No", count: 0 },
        { name: "Planning To", count: 0 },
      ]
    }

    // Count occurrences of each response
    const responseCounts: Record<string, number> = {
      Yes: 0,
      No: 0,
      "Planning To": 0,
    }

    data.forEach((item) => {
      if (item.legal_consultation) {
        responseCounts[item.legal_consultation] += 1
      }
    })

    // Convert to array of objects for charting
    const legalConsultationData = Object.entries(responseCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return legalConsultationData
  } catch (error) {
    console.error("Error in getLegalConsultationData:", error)
    return [
      { name: "Yes", count: 0 },
      { name: "No", count: 0 },
      { name: "Planning To", count: 0 },
    ]
  }
}

// Update the getImmediatePlansData function to handle empty results
export async function getImmediatePlansData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("immediate_plans")
      .not("immediate_plans", "is", null)

    if (error) {
      console.error("Error getting immediate plans data:", error)
      throw new Error("Failed to get immediate plans data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each plan (flattening the arrays)
    const planCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.immediate_plans && Array.isArray(item.immediate_plans)) {
        item.immediate_plans.forEach((plan) => {
          planCounts[plan] = (planCounts[plan] || 0) + 1
        })
      }
    })

    // Convert to array of objects for charting
    const plansData = Object.entries(planCounts).map(([id, count]) => {
      // Map the ID to a readable label
      let name = id
      switch (id) {
        case "reinstatement":
          name = "Applying for SEVIS Reinstatement"
          break
        case "litigation":
          name = "Exploring Litigation Options"
          break
        case "depart":
          name = "Planning to Depart the U.S."
          break
        case "transfer":
          name = "Seeking Transfer to Another School"
          break
        case "other-visa":
          name = "Exploring Other Visa Options"
          break
        case "waiting":
          name = "Waiting / Undecided"
          break
        case "contacting-university":
          name = "Contacting University DSO/Officials"
          break
      }
      return { name, count }
    })

    return plansData
  } catch (error) {
    console.error("Error in getImmediatePlansData:", error)
    return [] // Return empty array if there's an error
  }
}
