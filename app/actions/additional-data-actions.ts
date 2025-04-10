"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

// Get academic level distribution
export async function getAcademicLevelData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("academic_level")
      .not("academic_level", "is", null)

    if (error) {
      console.error("Error getting academic level data:", error)
      throw new Error("Failed to get academic level data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each academic level
    const levelCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.academic_level) {
        levelCounts[item.academic_level] = (levelCounts[item.academic_level] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const academicLevelData = Object.entries(levelCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return academicLevelData
  } catch (error) {
    console.error("Error in getAcademicLevelData:", error)
    return [] // Return empty array if there's an error
  }
}

// Get fingerprinting status distribution
export async function getFingerprintingData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("was_fingerprinted")
      .not("was_fingerprinted", "is", null)

    if (error) {
      console.error("Error getting fingerprinting data:", error)
      throw new Error("Failed to get fingerprinting data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return [
        { name: "Yes", count: 0 },
        { name: "No", count: 0 },
        { name: "Unsure", count: 0 },
      ]
    }

    // Count occurrences of each response
    const responseCounts: Record<string, number> = {
      Yes: 0,
      No: 0,
      Unsure: 0,
    }

    data.forEach((item) => {
      if (item.was_fingerprinted) {
        responseCounts[item.was_fingerprinted] += 1
      }
    })

    // Convert to array of objects for charting
    const fingerprintingData = Object.entries(responseCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return fingerprintingData
  } catch (error) {
    console.error("Error in getFingerprintingData:", error)
    return [
      { name: "Yes", count: 0 },
      { name: "No", count: 0 },
      { name: "Unsure", count: 0 },
    ]
  }
}

// Get arrest status distribution
export async function getArrestData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("was_arrested").not("was_arrested", "is", null)

    if (error) {
      console.error("Error getting arrest data:", error)
      throw new Error("Failed to get arrest data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return [
        { name: "Yes", count: 0 },
        { name: "No", count: 0 },
        { name: "Unsure", count: 0 },
      ]
    }

    // Count occurrences of each response
    const responseCounts: Record<string, number> = {
      Yes: 0,
      No: 0,
      Unsure: 0,
    }

    data.forEach((item) => {
      if (item.was_arrested) {
        responseCounts[item.was_arrested] += 1
      }
    })

    // Convert to array of objects for charting
    const arrestData = Object.entries(responseCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return arrestData
  } catch (error) {
    console.error("Error in getArrestData:", error)
    return [
      { name: "Yes", count: 0 },
      { name: "No", count: 0 },
      { name: "Unsure", count: 0 },
    ]
  }
}

// Get H1B lottery status distribution
export async function getH1BStatusData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("h1b_status").not("h1b_status", "is", null)

    if (error) {
      console.error("Error getting H1B status data:", error)
      throw new Error("Failed to get H1B status data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each status
    const statusCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.h1b_status) {
        statusCounts[item.h1b_status] = (statusCounts[item.h1b_status] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const h1bStatusData = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return h1bStatusData
  } catch (error) {
    console.error("Error in getH1BStatusData:", error)
    return [] // Return empty array if there's an error
  }
}

// Get legal case status distribution
export async function getLegalCaseStatusData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("legal_case_status")
      .not("legal_case_status", "is", null)

    if (error) {
      console.error("Error getting legal case status data:", error)
      throw new Error("Failed to get legal case status data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each status
    const statusCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.legal_case_status) {
        statusCounts[item.legal_case_status] = (statusCounts[item.legal_case_status] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const legalCaseStatusData = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return legalCaseStatusData
  } catch (error) {
    console.error("Error in getLegalCaseStatusData:", error)
    return [] // Return empty array if there's an error
  }
}

// Get incident type distribution
export async function getIncidentTypeData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("submissions").select("incident_type").not("incident_type", "is", null)

    if (error) {
      console.error("Error getting incident type data:", error)
      throw new Error("Failed to get incident type data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each type
    const typeCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.incident_type) {
        typeCounts[item.incident_type] = (typeCounts[item.incident_type] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const incidentTypeData = Object.entries(typeCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return incidentTypeData
  } catch (error) {
    console.error("Error in getIncidentTypeData:", error)
    return [] // Return empty array if there's an error
  }
}

// Get SEVIS notification method distribution
export async function getNotificationMethodData() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("submissions")
      .select("sevis_notification_method")
      .not("sevis_notification_method", "is", null)

    if (error) {
      console.error("Error getting notification method data:", error)
      throw new Error("Failed to get notification method data")
    }

    // Handle empty data
    if (!data || data.length === 0) {
      return []
    }

    // Count occurrences of each method
    const methodCounts: Record<string, number> = {}
    data.forEach((item) => {
      if (item.sevis_notification_method) {
        methodCounts[item.sevis_notification_method] = (methodCounts[item.sevis_notification_method] || 0) + 1
      }
    })

    // Convert to array of objects for charting
    const notificationMethodData = Object.entries(methodCounts).map(([name, count]) => ({
      name,
      count,
    }))

    return notificationMethodData
  } catch (error) {
    console.error("Error in getNotificationMethodData:", error)
    return [] // Return empty array if there's an error
  }
}
