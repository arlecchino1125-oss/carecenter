-- Initial local schema baseline for the NORSU system.
-- Table definitions and constraints aligned with the provided cloud schema.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

create table public.departments (
  id bigint generated always as identity not null,
  name text not null unique,
  constraint departments_pkey primary key (id)
);

create table public.admission_schedules (
  id bigint generated always as identity not null,
  date date not null unique,
  venue text,
  slots integer,
  is_active boolean default true,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint admission_schedules_pkey primary key (id)
);

create table public.forms (
  id bigint generated always as identity not null,
  title text not null,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  constraint forms_pkey primary key (id)
);

create table public.office_visit_reasons (
  id bigint generated always as identity not null,
  reason text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  constraint office_visit_reasons_pkey primary key (id)
);

create table public.scholarships (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  title text not null,
  deadline date,
  description text,
  requirements text,
  constraint scholarships_pkey primary key (id)
);

create table public.events (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  title text not null,
  type text not null,
  description text,
  location text,
  event_date date,
  event_time text,
  attendees bigint default 0,
  end_time time without time zone,
  latitude double precision,
  longitude double precision,
  constraint events_pkey primary key (id)
);

create table public.courses (
  id bigint generated always as identity not null,
  name text not null unique,
  department_id bigint,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  capacity integer default 100,
  application_limit integer default 200,
  status text default 'Open'::text,
  constraint courses_pkey primary key (id),
  constraint courses_department_id_fkey foreign key (department_id) references public.departments(id)
);

create table public.students (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  first_name text not null,
  last_name text not null,
  student_id text not null unique,
  course text,
  year_level text,
  status text default 'Active'::text,
  department text,
  middle_name text,
  dob date,
  gender text,
  civil_status text,
  nationality text,
  email text,
  mobile text,
  address text,
  emergency_contact text,
  street text,
  city text,
  province text,
  zip_code text,
  suffix text,
  place_of_birth text,
  age integer,
  sex text,
  gender_identity text,
  facebook_url text,
  school_last_attended text,
  is_working_student boolean default false,
  working_student_type text,
  supporter text,
  supporter_contact text,
  is_pwd boolean default false,
  pwd_type text,
  is_indigenous boolean default false,
  indigenous_group text,
  witnessed_conflict boolean default false,
  is_solo_parent boolean default false,
  is_child_of_solo_parent boolean default false,
  priority_course text,
  alt_course_1 text,
  alt_course_2 text,
  password text,
  section text default ''::text,
  profile_picture_url text,
  religion text,
  is_safe_in_community boolean default false,
  mother_name text,
  mother_occupation text,
  mother_contact text,
  father_name text,
  father_occupation text,
  father_contact text,
  parent_address text,
  num_brothers text,
  num_sisters text,
  birth_order text,
  spouse_name text,
  spouse_occupation text,
  num_children text,
  guardian_name text,
  guardian_address text,
  guardian_contact text,
  guardian_relation text,
  emergency_name text,
  emergency_address text,
  emergency_relationship text,
  emergency_number text,
  elem_school text,
  elem_year_graduated text,
  junior_high_school text,
  junior_high_year_graduated text,
  senior_high_school text,
  senior_high_year_graduated text,
  college_school text,
  college_year_graduated text,
  honors_awards text,
  extracurricular_activities text,
  scholarships_availed text,
  profile_completed boolean default false,
  has_seen_tour boolean default false,
  constraint students_pkey primary key (id),
  constraint students_department_fkey foreign key (department) references public.departments(name),
  constraint students_course_fkey foreign key (course) references public.courses(name)
);

create table public.enrolled_students (
  student_id text not null unique,
  is_used boolean default false,
  assigned_to_email text,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  course text,
  status text default 'Pending'::text,
  constraint enrolled_students_pkey primary key (student_id),
  constraint enrolled_students_course_fkey foreign key (course) references public.courses(name)
);

create table public.applications (
  id uuid not null default gen_random_uuid(),
  reference_id text not null unique,
  first_name text not null,
  last_name text not null,
  middle_name text,
  email text not null unique,
  mobile text not null,
  priority_course text not null,
  test_date date not null,
  username text not null unique,
  password text not null,
  status text default 'Submitted'::text,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  civil_status text,
  nationality text,
  reason text,
  street text,
  city text,
  province text,
  zip_code text,
  alt_course_1 text,
  alt_course_2 text,
  student_id text,
  suffix text,
  place_of_birth text,
  age integer,
  sex text,
  gender_identity text,
  facebook_url text,
  dob date,
  current_choice integer default 1,
  interview_date text,
  constraint applications_pkey primary key (id),
  constraint applications_priority_course_fkey foreign key (priority_course) references public.courses(name),
  constraint applications_alt_course_1_fkey foreign key (alt_course_1) references public.courses(name),
  constraint applications_alt_course_2_fkey foreign key (alt_course_2) references public.courses(name),
  constraint applications_test_date_fkey foreign key (test_date) references public.admission_schedules(date),
  constraint applications_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.audit_logs (
  id bigint generated always as identity not null,
  user_name text,
  action text,
  details text,
  created_at timestamp with time zone default now(),
  constraint audit_logs_pkey primary key (id)
);

create table public.questions (
  id bigint generated always as identity not null,
  form_id bigint,
  question_text text not null,
  question_type text default 'scale'::text,
  scale_min integer default 1,
  scale_max integer default 5,
  order_index integer default 0,
  created_at timestamp with time zone default now(),
  constraint questions_pkey primary key (id),
  constraint questions_form_id_fkey foreign key (form_id) references public.forms(id)
);

create table public.submissions (
  id bigint generated always as identity not null,
  form_id bigint,
  student_id text,
  submitted_at timestamp with time zone default now(),
  constraint submissions_pkey primary key (id),
  constraint submissions_form_id_fkey foreign key (form_id) references public.forms(id),
  constraint fk_submissions_students foreign key (student_id) references public.students(student_id)
);

create table public.answers (
  id bigint generated always as identity not null,
  submission_id bigint,
  question_id bigint,
  answer_value integer,
  answer_text text,
  created_at timestamp with time zone default now(),
  constraint answers_pkey primary key (id),
  constraint answers_submission_id_fkey foreign key (submission_id) references public.submissions(id),
  constraint answers_question_id_fkey foreign key (question_id) references public.questions(id)
);

create table public.counseling_requests (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  student_id text,
  student_name text,
  request_type text,
  description text,
  status text default 'Pending'::text,
  scheduled_date timestamp with time zone,
  department text,
  resolution_notes text,
  confidential_notes text,
  feedback text,
  rating integer,
  course_year text,
  contact_number text,
  reason_for_referral text,
  personal_actions_taken text,
  date_duration_of_concern text,
  referred_by text,
  referrer_contact_number text,
  relationship_with_student text,
  actions_made text,
  date_duration_of_observations text,
  referrer_signature text,
  constraint counseling_requests_pkey primary key (id),
  constraint counseling_requests_department_fkey foreign key (department) references public.departments(name),
  constraint counseling_requests_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.event_attendance (
  id bigint generated always as identity not null,
  event_id bigint,
  student_id text not null,
  student_name text,
  checked_in_at timestamp with time zone default timezone('utc'::text, now()),
  time_in timestamp with time zone,
  time_out timestamp with time zone,
  proof_url text,
  latitude double precision,
  longitude double precision,
  department text,
  constraint event_attendance_pkey primary key (id),
  constraint event_attendance_event_id_fkey foreign key (event_id) references public.events(id),
  constraint event_attendance_department_fkey foreign key (department) references public.departments(name),
  constraint event_attendance_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.event_feedback (
  id bigint generated always as identity not null,
  event_id bigint,
  student_id text not null,
  student_name text,
  rating integer check (rating >= 1 and rating <= 5),
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  sex text,
  college text,
  date_of_activity date,
  q1_score integer,
  q2_score integer,
  q3_score integer,
  q4_score integer,
  q5_score integer,
  q6_score integer,
  q7_score integer,
  open_best text,
  open_suggestions text,
  open_comments text,
  constraint event_feedback_pkey primary key (id),
  constraint event_feedback_event_id_fkey foreign key (event_id) references public.events(id),
  constraint event_feedback_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.general_feedback (
  id uuid not null default gen_random_uuid(),
  student_id text not null,
  student_name text not null,
  client_type text,
  sex text,
  age integer,
  region text,
  service_availed text,
  cc1 integer,
  cc2 integer,
  cc3 integer,
  sqd0 integer,
  sqd1 integer,
  sqd2 integer,
  sqd3 integer,
  sqd4 integer,
  sqd5 integer,
  sqd6 integer,
  sqd7 integer,
  sqd8 integer,
  suggestions text,
  email text,
  created_at timestamp with time zone default now(),
  constraint general_feedback_pkey primary key (id)
);

create table public.needs_assessments (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  student_id text,
  age integer,
  gender text,
  year_level text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  constraint needs_assessments_pkey primary key (id),
  constraint fk_needs_assessments_students foreign key (student_id) references public.students(student_id)
);

create table public.notifications (
  id bigint generated always as identity not null,
  student_id text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  constraint notifications_pkey primary key (id),
  constraint notifications_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.office_visits (
  id bigint generated always as identity not null,
  student_id text,
  student_name text,
  reason text,
  time_in timestamp with time zone default now(),
  time_out timestamp with time zone,
  status text default 'Ongoing'::text,
  constraint office_visits_pkey primary key (id),
  constraint office_visits_reason_fkey foreign key (reason) references public.office_visit_reasons(reason),
  constraint office_visits_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.scholarship_applications (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  scholarship_id bigint not null,
  student_id text not null,
  student_name text,
  course text,
  year_level text,
  contact_number text,
  email text,
  status text default 'Applied'::text,
  constraint scholarship_applications_pkey primary key (id),
  constraint scholarship_applications_scholarship_id_fkey foreign key (scholarship_id) references public.scholarships(id),
  constraint scholarship_applications_student_id_fkey foreign key (student_id) references public.students(student_id)
);

create table public.staff_accounts (
  id bigint generated always as identity not null,
  username text not null unique,
  password text not null,
  full_name text,
  role text not null,
  department text,
  email text,
  created_at timestamp with time zone default now(),
  constraint staff_accounts_pkey primary key (id),
  constraint staff_accounts_department_fkey foreign key (department) references public.departments(name)
);

create table public.support_requests (
  id bigint generated always as identity not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  student_id text not null,
  student_name text,
  department text,
  support_type text,
  description text,
  documents_url text,
  status text default 'Submitted'::text,
  care_notes text,
  care_documents_url text,
  dept_notes text,
  resolution_notes text,
  constraint support_requests_pkey primary key (id),
  constraint support_requests_department_fkey foreign key (department) references public.departments(name),
  constraint support_requests_student_id_fkey foreign key (student_id) references public.students(student_id)
);
