-- Auth-first RLS hardening for all roles.
-- Goal: block random anonymous access while preserving core public applicant flows.

-- 1) Helper functions used in policies.
create or replace function public.current_auth_email()
returns text
language sql
stable
as $$
  select lower(coalesce((auth.jwt() ->> 'email'), ''));
$$;

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select sa.role
  from public.staff_accounts sa
  where lower(coalesce(sa.email, '')) = public.current_auth_email()
  order by sa.created_at desc nulls last
  limit 1;
$$;

create or replace function public.current_student_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select s.student_id
  from public.students s
  where lower(coalesce(s.email, '')) = public.current_auth_email()
  order by s.created_at desc nulls last
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_staff_role() = 'Admin';
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select public.current_staff_role() in ('Admin', 'Department Head', 'Care Staff');
$$;

grant execute on function public.current_auth_email() to anon, authenticated, service_role;
grant execute on function public.current_staff_role() to anon, authenticated, service_role;
grant execute on function public.current_student_id() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_staff() to anon, authenticated, service_role;

-- 2) Drop all existing public-schema policies and rebuild with stricter ones.
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- Make sure RLS is enabled on every public table.
do $$
declare t record;
begin
  for t in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- 3) Staff full-access policies across operational tables.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'admission_schedules',
    'answers',
    'applications',
    'audit_logs',
    'counseling_requests',
    'courses',
    'departments',
    'enrolled_students',
    'event_attendance',
    'event_feedback',
    'events',
    'forms',
    'general_feedback',
    'needs_assessments',
    'notifications',
    'office_visit_reasons',
    'office_visits',
    'questions',
    'scholarship_applications',
    'scholarships',
    'students',
    'submissions',
    'support_requests'
  ]
  loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())',
      'p_staff_all_' || tbl,
      tbl
    );
  end loop;
end $$;

-- 4) Public read policies for data needed before login.
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'admission_schedules',
    'courses',
    'departments',
    'events',
    'forms',
    'questions',
    'scholarships',
    'office_visit_reasons'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      'p_public_read_' || tbl,
      tbl
    );
  end loop;
end $$;

-- 5) Application intake remains public (NAT/applicant flow).
create policy p_applications_public_insert
on public.applications
for insert
to anon, authenticated
with check (true);

create policy p_applications_public_select
on public.applications
for select
to anon, authenticated
using (true);

create policy p_applications_public_update
on public.applications
for update
to anon, authenticated
using (true)
with check (true);

-- 6) Staff accounts: admin full control, staff can read their own row.
create policy p_staff_accounts_self_select
on public.staff_accounts
for select
to authenticated
using (lower(coalesce(email, '')) = public.current_auth_email());

create policy p_staff_accounts_admin_all
on public.staff_accounts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 7) Students table:
--    - students can read/update own profile
--    - staff full control (already from p_staff_all_students)
--    - anon activation insert allowed only with a valid unused enrollment key
create policy p_students_self_select
on public.students
for select
to authenticated
using (lower(coalesce(email, '')) = public.current_auth_email());

create policy p_students_self_update
on public.students
for update
to authenticated
using (lower(coalesce(email, '')) = public.current_auth_email())
with check (lower(coalesce(email, '')) = public.current_auth_email());

create policy p_students_activation_insert
on public.students
for insert
to anon
with check (
  student_id is not null
  and email is not null
  and password is not null
  and exists (
    select 1
    from public.enrolled_students es
    where es.student_id = student_id
      and coalesce(es.is_used, false) = false
      and (es.course is null or es.course = course)
  )
);

-- 8) Enrollment keys:
--    - anon can verify and consume unused keys during activation
--    - staff full control (already from p_staff_all_enrolled_students)
create policy p_enrolled_students_activation_select
on public.enrolled_students
for select
to anon
using (coalesce(is_used, false) = false);

create policy p_enrolled_students_activation_update
on public.enrolled_students
for update
to anon
using (coalesce(is_used, false) = false)
with check (coalesce(is_used, false) = true and assigned_to_email is not null);

-- 9) Student-owned operational tables.
create policy p_notifications_student_select
on public.notifications
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_notifications_student_update
on public.notifications
for update
to authenticated
using (student_id = public.current_student_id())
with check (student_id = public.current_student_id());

create policy p_counseling_student_select
on public.counseling_requests
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_counseling_student_insert
on public.counseling_requests
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_counseling_student_update
on public.counseling_requests
for update
to authenticated
using (student_id = public.current_student_id())
with check (student_id = public.current_student_id());

create policy p_support_student_select
on public.support_requests
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_support_student_insert
on public.support_requests
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_support_student_update
on public.support_requests
for update
to authenticated
using (student_id = public.current_student_id())
with check (student_id = public.current_student_id());

create policy p_office_visits_student_select
on public.office_visits
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_office_visits_student_insert
on public.office_visits
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_office_visits_student_update
on public.office_visits
for update
to authenticated
using (student_id = public.current_student_id())
with check (student_id = public.current_student_id());

create policy p_event_attendance_student_select
on public.event_attendance
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_event_attendance_student_insert
on public.event_attendance
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_event_feedback_student_select
on public.event_feedback
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_event_feedback_student_insert
on public.event_feedback
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_needs_assessments_student_select
on public.needs_assessments
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_needs_assessments_student_insert
on public.needs_assessments
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_general_feedback_student_select
on public.general_feedback
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_general_feedback_student_insert
on public.general_feedback
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_scholarship_apps_student_select
on public.scholarship_applications
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_scholarship_apps_student_insert
on public.scholarship_applications
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_submissions_student_select
on public.submissions
for select
to authenticated
using (student_id = public.current_student_id());

create policy p_submissions_student_insert
on public.submissions
for insert
to authenticated
with check (student_id = public.current_student_id());

create policy p_answers_student_select
on public.answers
for select
to authenticated
using (
  exists (
    select 1
    from public.submissions s
    where s.id = submission_id
      and s.student_id = public.current_student_id()
  )
);

create policy p_answers_student_insert
on public.answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.submissions s
    where s.id = submission_id
      and s.student_id = public.current_student_id()
  )
);
