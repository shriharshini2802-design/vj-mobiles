// =============================================
// ADMIN - ORDERS MANAGEMENT
// VJ Mobiles
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// GET ALL ORDERS (latest first)
// =============================================
export async function getAllOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET ORDERS BY STATUS
// =============================================
export async function getOrdersByStatus(status) {
  try {
    const { data, error } = await supabase
      .from("orders")
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
// UPDATE ORDER STATUS
// =============================================
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("order_id", orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET ORDER STATS (dashboard cards)
// =============================================
export async function getOrderStats() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("status");

    if (error) throw error;

    const stats = {
      total:          data.length,
      orderPlaced:    data.filter((o) => o.status === "Order Placed").length,
      adminApproved:  data.filter((o) => o.status === "Admin Approved").length,
      orderPacked:    data.filter((o) => o.status === "Order Packed").length,
      shipped:        data.filter((o) => o.status === "Shipped").length,
      outForDelivery: data.filter((o) => o.status === "Out for Delivery").length,
      delivered:      data.filter((o) => o.status === "Delivered").length,
      cancelled:      data.filter((o) => o.status === "Cancelled").length,
    };

    return { success: true, data: stats };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET TOTAL REVENUE (delivered orders)
// =============================================
export async function getTotalRevenue() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "Delivered");

    if (error) throw error;

    const total = data.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { success: true, data: total };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// SEARCH ORDERS
// =============================================
export async function searchOrders(query) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(
        `full_name.ilike.%${query}%,` +
        `mobile.ilike.%${query}%,` +
        `order_id.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}
