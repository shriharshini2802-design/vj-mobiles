// =============================================
// USER AUTHENTICATION
// VJ Mobiles - Supabase Auth
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// SIGN UP - New customer registration
// =============================================
export async function signUp(fullName, email, mobile, password) {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Insert profile into users table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id:        authData.user.id,
          full_name: fullName,
          email:     email,
          mobile:    mobile,
        });

      if (profileError) throw profileError;
    }

    return { success: true, user: authData.user };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// LOGIN - Existing customer
// =============================================
export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch profile
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    return { success: true, user: data.user, profile };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// LOGOUT
// =============================================
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, message: error.message };
  return { success: true };
}


// =============================================
// GET CURRENT USER
// =============================================
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return { ...user, profile };

  } catch {
    return null;
  }
}


// =============================================
// UPDATE PROFILE
// =============================================
export async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// AUTH STATE CHANGE LISTENER
// Use this on every page to auto-detect login/logout
// =============================================
export function onAuthStateChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
