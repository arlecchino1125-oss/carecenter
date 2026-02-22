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
const isWeakPassword = (value: unknown) => typeof value !== 'string' || value.length < 6;
const isDuplicateUserError = (message: string) =>
  message.includes('already been registered') || message.includes('already exists');

async function findAuthUserByEmail(email: string) {
  const target = normalizeEmail(email);
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Failed to list auth users: ${error.message}`);

    const users = data?.users || [];
    const match = users.find((u) => normalizeEmail(u.email) === target);
    if (match) return match;
    if (users.length < perPage) break;
    page += 1;
  }

  return null;
}

async function assertCallerIsAdmin(req: Request) {
  const authHeader = req.headers.get('Authorization') || '';
  const jwt = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) throw new Error('Missing bearer token.');

  const { data, error } = await admin.auth.getUser(jwt);
  if (error || !data?.user?.email) throw new Error('Invalid auth token.');

  const callerEmail = normalizeEmail(data.user.email);
  const { data: staff, error: staffError } = await admin
    .from('staff_accounts')
    .select('role,email')
    .ilike('email', callerEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (staffError) throw new Error(`Failed to verify caller role: ${staffError.message}`);
  if (!staff || staff.role !== 'Admin') throw new Error('Only Admin accounts can provision auth users.');

  return callerEmail;
}

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
    await assertCallerIsAdmin(req);

    const payload = await req.json();
    const email = normalizeEmail(payload?.email);
    const password = payload?.password;
    const userMetadata = typeof payload?.user_metadata === 'object' && payload.user_metadata !== null
      ? payload.user_metadata
      : {};

    if (!email || !email.includes('@')) {
      throw new Error('A valid email is required.');
    }
    if (isWeakPassword(password)) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { data: createData, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (!createError) {
      return new Response(
        JSON.stringify({
          success: true,
          status: 'created',
          user_id: createData.user?.id || null,
          email,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const errorMessage = String(createError.message || '').toLowerCase();
    if (!isDuplicateUserError(errorMessage)) {
      throw new Error(createError.message);
    }

    const existing = await findAuthUserByEmail(email);
    if (!existing?.id) {
      throw new Error('Auth user already exists but could not be found for update.');
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: userMetadata,
    });

    if (updateError) {
      throw new Error(`Failed to update existing auth user: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: 'updated',
        user_id: existing.id,
        email,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

