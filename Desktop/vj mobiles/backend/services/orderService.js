// =============================================
// ORDER SERVICE
// VJ Mobiles - Place & Track accessory orders
// =============================================

import { supabase } from "../supabase.js";


// =============================================
// GENERATE ORDER ID
// Format: ORD-XXXXX (5 digit random number)
// =============================================
function generateOrderId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${num}`;
}


// =============================================
// PLACE ORDER
// Called from order.html on form submit
// =============================================
export async function placeOrder({
  fullName,
  mobile,
  email,
  address,
  accessoryId,
  productName,
  price,
  quantity,
  userId = null,       // null if guest checkout
}) {
  try {
    const orderId     = generateOrderId();
    const totalAmount = price * quantity;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_id:     orderId,
        user_id:      userId,
        full_name:    fullName,
        mobile:       mobile,
        email:        email,
        address:      address,
        accessory_id: accessoryId,
        product_name: productName,
        price:        price,
        quantity:     quantity,
        total_amount: totalAmount,
        status:       "Order Placed",
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data, orderId };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// TRACK ORDER BY ORDER ID
// Called from trackorder.html
// =============================================
export async function trackOrderById(orderId) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId.toUpperCase())
      .single();

    if (error) throw error;
    if (!data) return { success: false, message: "Order not found" };

    return { success: true, data };

  } catch (error) {
    return { success: false, message: "Order not found. Check the Order ID." };
  }
}


// =============================================
// TRACK ORDER BY MOBILE NUMBER
// Returns latest order for that mobile
// =============================================
export async function trackOrderByMobile(mobile) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("mobile", mobile)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    if (!data || data.length === 0) {
      return { success: false, message: "No orders found for this number." };
    }

    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


// =============================================
// GET MY ORDERS (Logged-in user)
// Called from My Activities modal
// =============================================
export async function getMyOrders(userId) {
  try {
    const { data, error } = await supabase
      .from("orders")
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
// STATUS → STEP NUMBER
// Maps DB status to tracking step (1–6)
// =============================================
export function getOrderStep(status) {
  const steps = {
    "Order Placed":       1,
    "Admin Approved":     2,
    "Order Packed":       3,
    "Shipped":            4,
    "Out for Delivery":   5,
    "Delivered":          6,
    "Cancelled":          0,
  };
  return steps[status] ?? 1;
}
