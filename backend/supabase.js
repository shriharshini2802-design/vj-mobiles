// =============================================
// SUPABASE CLIENT SETUP — VJ Mobiles
// Keys are loaded from /config.js (gitignored)
// =============================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
