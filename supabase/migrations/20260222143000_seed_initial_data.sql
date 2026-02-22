-- Seed baseline data for cloud/local environments.
-- Generated from supabase/seed.sql so it can be applied via `supabase db push`.

-- Starter seed data for local development.
-- This file is idempotent and safe to re-run via `supabase db reset`.
-- NOTE: Staff passwords are plaintext to match the current app login implementation.

-- 1) Departments used by admin/department workflows
insert into public.departments (name)
values
  ('College of Arts and Sciences'),
  ('College of Engineering'),
  ('College of Education'),
  ('College of Agriculture and Forestry'),
  ('College of Criminal Justice Education'),
  ('College of Information Technology'),
  ('College of Nursing'),
  ('College of Business')
on conflict (name) do nothing;

-- 2) Courses mapped to departments
insert into public.courses (name, department_id, capacity, application_limit, status)
select
  v.course_name,
  d.id,
  v.capacity,
  v.application_limit,
  'Open'
from (
  values
    ('BS Psychology', 'College of Arts and Sciences', 120, 300),
    ('BS Mathematics', 'College of Arts and Sciences', 100, 250),
    ('BS Civil Engineering', 'College of Engineering', 120, 300),
    ('BS Mechanical Engineering', 'College of Engineering', 100, 250),
    ('BSEd English', 'College of Education', 120, 300),
    ('BSEd Mathematics', 'College of Education', 120, 300),
    ('BS Agriculture', 'College of Agriculture and Forestry', 100, 220),
    ('BS Forestry', 'College of Agriculture and Forestry', 80, 180),
    ('BS Criminology', 'College of Criminal Justice Education', 180, 400),
    ('BS Information Technology', 'College of Information Technology', 220, 500),
    ('BS Computer Science', 'College of Information Technology', 150, 350),
    ('BS Nursing', 'College of Nursing', 120, 250),
    ('BS Business Administration', 'College of Business', 200, 450),
    ('BS Accountancy', 'College of Business', 120, 260)
) as v(course_name, department_name, capacity, application_limit)
join public.departments d
  on d.name = v.department_name
on conflict (name) do update
set
  department_id = excluded.department_id,
  capacity = excluded.capacity,
  application_limit = excluded.application_limit,
  status = excluded.status;

-- 3) NAT admission schedules (relative dates keep them valid over time)
insert into public.admission_schedules (date, venue, slots, is_active)
values
  ((current_date + interval '3 day')::date, 'NORSU Main Campus', 250, true),
  ((current_date + interval '10 day')::date, 'NORSU Main Campus', 250, true),
  ((current_date + interval '17 day')::date, 'NORSU Main Campus', 250, true)
on conflict (date) do update
set
  venue = excluded.venue,
  slots = excluded.slots,
  is_active = excluded.is_active;

-- 4) Office visit reason options
insert into public.office_visit_reasons (reason, is_active)
values
  ('Counseling', true),
  ('Academic Concern', true),
  ('Personal Concern', true),
  ('Career Guidance', true),
  ('Follow-up Session', true),
  ('Document Request', true),
  ('Other', true)
on conflict (reason) do update
set
  is_active = true;

-- 5) Staff users (for local login testing)
-- Admin login:
--   username: admin
--   password: admin123
insert into public.staff_accounts (username, password, full_name, role, department, email)
values
  ('admin', 'admin123', 'System Administrator', 'Admin', null, 'admin@norsu.local'),
  ('carestaff', 'care123', 'CARE Staff', 'Care Staff', null, 'carestaff@norsu.local'),
  ('depthead_cas', 'dept123', 'Dept Head - CAS', 'Department Head', 'College of Arts and Sciences', 'depthead.cas@norsu.local')
on conflict (username) do update
set
  password = excluded.password,
  full_name = excluded.full_name,
  role = excluded.role,
  department = excluded.department,
  email = excluded.email;

-- 6) Optional starter scholarship/event/form data for non-empty dashboards
insert into public.scholarships (title, deadline, description, requirements)
values
  (
    'Academic Excellence Scholarship',
    (current_date + interval '45 day')::date,
    'Scholarship for students with strong academic performance.',
    'Latest grades, recommendation letter, and completed application form.'
  )
on conflict do nothing;

insert into public.events (title, type, description, location, event_date, event_time, attendees, latitude, longitude)
values
  (
    'NAT Orientation',
    'Announcement',
    'Orientation for incoming NAT applicants and examinees.',
    'NORSU Main Campus',
    (current_date + interval '2 day')::date,
    '09:00 AM',
    0,
    9.306,
    123.306
  )
on conflict do nothing;

insert into public.forms (title, description, is_active)
values
  ('Student Wellness Check', 'Quick check-in form for student wellness analytics.', true)
on conflict do nothing;

insert into public.questions (form_id, question_text, question_type, scale_min, scale_max, order_index)
select
  f.id,
  q.question_text,
  'scale',
  1,
  5,
  q.order_index
from public.forms f
join (
  values
    ('I can manage my academic workload effectively.', 1),
    ('I feel supported by my instructors and peers.', 2),
    ('I know where to seek help when I need support.', 3)
) as q(question_text, order_index) on true
where f.title = 'Student Wellness Check'
  and not exists (
    select 1
    from public.questions existing
    where existing.form_id = f.id
      and existing.question_text = q.question_text
  );
