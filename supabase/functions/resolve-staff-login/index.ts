import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const normalizeEmail = (value: unknown) => String(value || '').trim().toLowerCase();

const invalidCredentials = () =>
  new Response(JSON.stringify({ error: 'Invalid username or password.' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const loginId = String(body?.loginId || '').trim();
    const password = String(body?.password || '');

    if (!loginId || !password) {
      return invalidCredentials();
    }

    const lookup = loginId.includes('@')
      ? admin
          .from('staff_accounts')
          .select('email,password')
          .ilike('email', normalizeEmail(loginId))
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      : admin
          .from('staff_accounts')
          .select('email,password')
          .ilike('username', loginId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

    const { data: staff, error } = await lookup;
    if (error) {
      throw error;
    }

    if (!staff || String(staff.password || '') !== password) {
      return invalidCredentials();
    }

    const email = normalizeEmail(staff.email);
    if (!email) {
      return invalidCredentials();
    }

    return new Response(JSON.stringify({ email }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Login lookup failed.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

