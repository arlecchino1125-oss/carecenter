import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = String(process.env.DRY_RUN || 'false').toLowerCase() === 'true';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const toEmail = (value) => String(value || '').trim().toLowerCase();
const hasUsablePassword = (value) => typeof value === 'string' && value.length >= 6;

async function listAllAuthUsers() {
  const usersByEmail = new Map();
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`auth.admin.listUsers failed on page ${page}: ${error.message}`);
    }

    const users = data?.users || [];
    for (const user of users) {
      const email = toEmail(user.email);
      if (email) usersByEmail.set(email, user);
    }

    if (users.length < perPage) break;
    page += 1;
  }

  return usersByEmail;
}

function isDuplicateUserError(error) {
  const msg = String(error?.message || '').toLowerCase();
  return msg.includes('already been registered') || msg.includes('already exists');
}

async function fetchRows(table, columns) {
  const { data, error } = await admin
    .from(table)
    .select(columns)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to read ${table}: ${error.message}`);
  return data || [];
}

async function createAuthUser(email, password, metadata) {
  if (DRY_RUN) return { dryRun: true };

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata
  });

  if (error) throw error;
  return { dryRun: false };
}

async function main() {
  let existingUsers = new Map();
  let hasReliableExistingMap = true;
  try {
    existingUsers = await listAllAuthUsers();
  } catch (error) {
    hasReliableExistingMap = false;
    console.warn(`Warning: ${error.message}`);
    console.warn('Proceeding without preloaded auth user list. Duplicate detection will rely on create errors.');
  }
  const seenEmails = new Set(existingUsers.keys());

  const summary = {
    created: 0,
    existing: 0,
    skippedNoEmail: 0,
    skippedWeakPassword: 0,
    skippedDuplicate: 0,
    failed: 0
  };

  const failures = [];

  const staffRows = await fetchRows(
    'staff_accounts',
    'id, created_at, username, full_name, role, email, password'
  );

  for (const row of staffRows) {
    const email = toEmail(row.email);
    if (!email) {
      summary.skippedNoEmail += 1;
      continue;
    }

    if (!hasUsablePassword(row.password)) {
      summary.skippedWeakPassword += 1;
      continue;
    }

    if (seenEmails.has(email)) {
      summary.existing += 1;
      continue;
    }

    try {
      await createAuthUser(email, row.password, {
        source_table: 'staff_accounts',
        app_role: row.role || 'Staff',
        staff_id: row.id,
        username: row.username || null,
        full_name: row.full_name || null
      });
      seenEmails.add(email);
      summary.created += 1;
    } catch (error) {
      if (isDuplicateUserError(error)) {
        summary.existing += 1;
        seenEmails.add(email);
      } else {
        summary.failed += 1;
        failures.push(`[staff_accounts] ${email}: ${error.message}`);
      }
    }
  }

  const studentRows = await fetchRows(
    'students',
    'id, created_at, student_id, first_name, last_name, email, password, status'
  );

  for (const row of studentRows) {
    const email = toEmail(row.email);
    if (!email) {
      summary.skippedNoEmail += 1;
      continue;
    }

    if (!hasUsablePassword(row.password)) {
      summary.skippedWeakPassword += 1;
      continue;
    }

    if (seenEmails.has(email)) {
      summary.skippedDuplicate += 1;
      continue;
    }

    try {
      await createAuthUser(email, row.password, {
        source_table: 'students',
        app_role: 'Student',
        student_row_id: row.id,
        student_id: row.student_id,
        student_status: row.status || null,
        full_name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || null
      });
      seenEmails.add(email);
      summary.created += 1;
    } catch (error) {
      if (isDuplicateUserError(error)) {
        summary.existing += 1;
        seenEmails.add(email);
      } else {
        summary.failed += 1;
        failures.push(`[students] ${email}: ${error.message}`);
      }
    }
  }

  console.log('\nAuth sync completed.');
  console.table(summary);

  if (DRY_RUN) {
    console.log('Dry run mode is ON. No users were created.');
    if (!hasReliableExistingMap) {
      console.log('Note: auth user existence could not be fully checked because listUsers failed.');
    }
  }

  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach((line) => console.log(`- ${line}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
