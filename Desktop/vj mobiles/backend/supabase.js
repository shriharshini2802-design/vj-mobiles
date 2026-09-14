// =============================================
// SUPABASE CLIENT SETUP
// VJ Mobiles
// =============================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://pzkrgsxceyxwooqeirtp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6a3Jnc3hjZXl4d29vcWVpcnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzODk3MDksImV4cCI6MjEwNDk2NTcwOX0.q50ejkA_bgf8qt4nNVQ5ZuOP6w-WnDqmfZTsjWO3dI8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
