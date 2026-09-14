// =============================================
// BOOKING SERVICE
// VJ Mobiles - Book & Track service requests
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// GENERATE SERVICE ID  e.g. SER-10025
// =============================================
function generateServiceId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `SER-${num}`;
}


// =============================================
// SUBMIT SERVICE BOOKING
// =============================================
export async function submitBooking({
  fullName,
  mobile,
  email,
  address,
  mobileBrand,
  mobileModel,
  serviceType,
  problemDescription,
  preferredDate,
  imageUrl = null,
  userId   = null,
}) {
  try {
    const serviceId = generateServiceId();

    const { data, error } = await supabase
      .from("service_bookings")
      .insert({
        service_id:          serviceId,
        user_id:             userId,
        full_name:           fullName,
        mobile:              mobile,
        email:               email,
        address:             address,
        mobile_brand:        mobileBrand,
        mobile_model:        mobileModel,
        service_type:        serviceType,
        problem_description: problemDescription,
        preferred_date:      preferredDate || null,
        image_url:           imageUrl,
        status:              "Booking Received",
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, serviceId };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// TRACK SERVICE BY SERVICE ID
// =============================================
export async function trackServiceById(serviceId) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("service_id", serviceId.toUpperCase())
      .single();

    if (error) throw error;
    if (!data) return { success: false, message: "Service booking not found." };

    return { success: true, data };

  } catch (error) {
    return { success: false, message: "Booking not found. Check the Service ID." };
  }
}


// =============================================
// TRACK SERVICE BY MOBILE
// =============================================
export async function trackServiceByMobile(mobile) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("mobile", mobile)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    if (!data || data.length === 0) {
      return { success: false, message: "No bookings found for this number." };
    }

    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET MY BOOKINGS (Logged-in user)
// =============================================
export async function getMyBookings(userId) {
  try {
    const { data, error } = await supabase
      .from("service_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// STATUS → STEP NUMBER  (for tracking UI)
// =============================================
export function getServiceStep(status) {
  const steps = {
    "Booking Received":    1,
    "Technician Assigned": 2,
    "Under Repair":        3,
    "Repair Completed":    4,
    "Ready for Pickup":    5,
    "Delivered":           6,
    "Cancelled":           0,
  };
  return steps[status] ?? 1;
}


// =============================================
// UPLOAD PROBLEM IMAGE to Supabase Storage
// =============================================
export async function uploadProblemImage(file) {
  try {
    const fileExt  = file.name.split(".").pop();
    const fileName = `service-${Date.now()}.${fileExt}`;
    const filePath = `problem-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("vj-mobiles")
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("vj-mobiles")
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };

  } catch (error) {
    return { success: false, message: error.message };
  }
}
