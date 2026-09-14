// =============================================
// ADMIN AUTHENTICATION
// VJ Mobiles
// =============================================
// NOTE: Admin login uses the 'admins' table with
// username + password. We compare the password
// hash server-side via a Supabase RPC function.
// For simplicity (pure frontend), we use the
// service-role via a direct check pattern.
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// ADMIN LOGIN
// Checks username + password against admins table
// Uses bcrypt comparison via Supabase RPC
// =============================================
export async function adminLogin(username, password) {
  try {
    // Call a Supabase database function to verify password
    const { data, error } = await supabase
      .rpc("verify_admin_password", {
        p_username: username,
        p_password: password,
      });

    if (error) throw error;

    if (!data || !data.success) {
      return { success: false, message: "Invalid username or password" };
    }

    // Store admin session in sessionStorage
    sessionStorage.setItem("adminLoggedIn", "true");
    sessionStorage.setItem("adminName", data.name);
    sessionStorage.setItem("adminUsername", username);

    return { success: true, name: data.name };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// CHECK IF ADMIN IS LOGGED IN
// Call this at the top of every admin page
// =============================================
export function isAdminLoggedIn() {
  return sessionStorage.getItem("adminLoggedIn") === "true";
}


// =============================================
// ADMIN LOGOUT
// =============================================
export function adminLogout() {
  sessionStorage.removeItem("adminLoggedIn");
  sessionStorage.removeItem("adminName");
  sessionStorage.removeItem("adminUsername");
  window.location.href = "../adminlogin.html";
}


// =============================================
// GUARD - Redirect to login if not admin
// Add this at the top of every admin page
// =============================================
export function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = "../adminlogin.html";
  }
}


// =============================================
// GET ADMIN NAME
// =============================================
export function getAdminName() {
  return sessionStorage.getItem("adminName") || "Admin";
}
