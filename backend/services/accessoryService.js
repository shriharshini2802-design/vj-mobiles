// =============================================
// ACCESSORY SERVICE
// VJ Mobiles - Fetch products from Supabase
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// GET ALL CATEGORIES
// =============================================
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from("accessories")
      .select("category")
      .eq("in_stock", true)
      .order("category");

    if (error) throw error;

    const categories = [...new Set(data.map((r) => r.category))];
    return { success: true, data: categories };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET BRANDS BY CATEGORY
// Used on brands.html
// =============================================
export async function getBrandsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from("accessories")
      .select("brand")
      .eq("category", category)
      .eq("in_stock", true)
      .order("brand");

    if (error) throw error;

    const brands = [...new Set(data.map((r) => r.brand))];
    return { success: true, data: brands };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET PRODUCTS BY CATEGORY + BRAND
// Used on models.html
// =============================================
export async function getProductsByBrandAndCategory(category, brand) {
  try {
    const { data, error } = await supabase
      .from("accessories")
      .select("*")
      .eq("category", category)
      .eq("brand", brand)
      .eq("in_stock", true)
      .order("price");

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET SINGLE PRODUCT BY ID
// Used on order.html
// =============================================
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from("accessories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET ALL PRODUCTS (Admin)
// =============================================
export async function getAllProducts() {
  try {
    const { data, error } = await supabase
      .from("accessories")
      .select("*")
      .order("category")
      .order("brand")
      .order("name");

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// SEARCH PRODUCTS
// =============================================
export async function searchProducts(query) {
  try {
    const { data, error } = await supabase
      .from("accessories")
      .select("*")
      .ilike("name", `%${query}%`)
      .eq("in_stock", true)
      .order("price");

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}
