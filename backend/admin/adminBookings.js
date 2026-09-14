// =============================================
// ADMIN - SERVICE BOOKINGS MANAGEMENT
// VJ Mobiles
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// GET ALL BOOKINGS (latest first)
// =============================================
export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET BOOKINGS BY STATUS
// =============================================
export async function getBookingsByStatus(status) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// UPDATE BOOKING STATUS
// =============================================
export async function updateBookingStatus(serviceId, newStatus) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .update({ status: newStatus })
      .eq("service_id", serviceId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// UPDATE ESTIMATED COST
// =============================================
export async function updateEstimatedCost(serviceId, cost) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .update({ estimated_cost: cost })
      .eq("service_id", serviceId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET BOOKING STATS (dashboard cards)
// =============================================
export async function getBookingStats() {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("status");

    if (error) throw error;

    const stats = {
      total:              data.length,
      bookingReceived:    data.filter((b) => b.status === "Booking Received").length,
      technicianAssigned: data.filter((b) => b.status === "Technician Assigned").length,
      underRepair:        data.filter((b) => b.status === "Under Repair").length,
      repairCompleted:    data.filter((b) => b.status === "Repair Completed").length,
      readyForPickup:     data.filter((b) => b.status === "Ready for Pickup").length,
      delivered:          data.filter((b) => b.status === "Delivered").length,
      cancelled:          data.filter((b) => b.status === "Cancelled").length,
    };

    return { success: true, data: stats };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// SEARCH BOOKINGS
// =============================================
export async function searchBookings(query) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("*")
      .or(
        `full_name.ilike.%${query}%,` +
        `mobile.ilike.%${query}%,` +
        `service_id.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}
