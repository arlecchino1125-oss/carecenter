-- Runtime objects used by the frontend (non-table schema objects).
-- Keeps public table definitions unchanged from the cloud schema.

-- RPC used by student event time-in flow.
drop function if exists public.increment_event_attendees(uuid);
drop function if exists public.increment_event_attendees(bigint);

create function public.increment_event_attendees(e_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.events
  set attendees = coalesce(attendees, 0) + 1
  where id = e_id;
end;
$$;

revoke all on function public.increment_event_attendees(bigint) from public;
grant execute on function public.increment_event_attendees(bigint) to anon, authenticated, service_role;

-- Storage buckets required by frontend uploads.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-pictures', 'profile-pictures', true, 52428800, null),
  ('support_documents', 'support_documents', true, 52428800, null),
  ('attendance_proofs', 'attendance_proofs', true, 52428800, null)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- profile-pictures policies (matches cloud naming/scope)
drop policy if exists profile_pictures_select on storage.objects;
drop policy if exists profile_pictures_insert on storage.objects;
drop policy if exists profile_pictures_update on storage.objects;
drop policy if exists profile_pictures_delete on storage.objects;
drop policy if exists "Allow profile picture select" on storage.objects;
drop policy if exists "Allow profile picture insert" on storage.objects;
drop policy if exists "Allow profile picture update" on storage.objects;
drop policy if exists "Allow profile picture delete" on storage.objects;

create policy "Allow profile picture select"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'profile-pictures');

create policy "Allow profile picture insert"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'profile-pictures');

create policy "Allow profile picture update"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'profile-pictures')
with check (bucket_id = 'profile-pictures');

create policy "Allow profile picture delete"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'profile-pictures');

-- support_documents policies (matches cloud naming/scope)
drop policy if exists support_documents_select on storage.objects;
drop policy if exists support_documents_insert on storage.objects;
drop policy if exists support_documents_update on storage.objects;
drop policy if exists support_documents_delete on storage.objects;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Insert" on storage.objects;
drop policy if exists "Authenticated users can upload support documents" on storage.objects;
drop policy if exists "Public can view support documents" on storage.objects;

create policy "Public Access"
on storage.objects
for select
to public
using (bucket_id = 'support_documents');

create policy "Public Insert"
on storage.objects
for insert
to public
with check (bucket_id = 'support_documents');

create policy "Authenticated users can upload support documents"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'support_documents');

create policy "Public can view support documents"
on storage.objects
for select
to public
using (bucket_id = 'support_documents');

-- attendance_proofs policies (matches cloud naming/scope)
drop policy if exists attendance_proofs_select on storage.objects;
drop policy if exists attendance_proofs_insert on storage.objects;
drop policy if exists attendance_proofs_update on storage.objects;
drop policy if exists attendance_proofs_delete on storage.objects;

create policy attendance_proofs_select
on storage.objects
for select
to public
using (bucket_id = 'attendance_proofs');

create policy attendance_proofs_insert
on storage.objects
for insert
to public
with check (bucket_id = 'attendance_proofs');

-- -----------------------------------------------------------------------------
-- Cloud parity diff (from original 20260222134150_remote_schema.sql)
-- Merged here so it runs after baseline table creation during local db reset.
-- -----------------------------------------------------------------------------

alter table "public"."answers" drop constraint "answers_question_id_fkey";

alter table "public"."answers" drop constraint "answers_submission_id_fkey";

alter table "public"."applications" drop constraint "applications_alt_course_1_fkey";

alter table "public"."applications" drop constraint "applications_alt_course_2_fkey";

alter table "public"."applications" drop constraint "applications_priority_course_fkey";

alter table "public"."applications" drop constraint "applications_student_id_fkey";

alter table "public"."applications" drop constraint "applications_test_date_fkey";

alter table "public"."counseling_requests" drop constraint "counseling_requests_department_fkey";

alter table "public"."counseling_requests" drop constraint "counseling_requests_student_id_fkey";

alter table "public"."enrolled_students" drop constraint "enrolled_students_course_fkey";

alter table "public"."event_attendance" drop constraint "event_attendance_department_fkey";

alter table "public"."event_attendance" drop constraint "event_attendance_event_id_fkey";

alter table "public"."event_attendance" drop constraint "event_attendance_student_id_fkey";

alter table "public"."event_feedback" drop constraint "event_feedback_event_id_fkey";

alter table "public"."event_feedback" drop constraint "event_feedback_student_id_fkey";

alter table "public"."needs_assessments" drop constraint "fk_needs_assessments_students";

alter table "public"."notifications" drop constraint "notifications_student_id_fkey";

alter table "public"."office_visits" drop constraint "office_visits_reason_fkey";

alter table "public"."office_visits" drop constraint "office_visits_student_id_fkey";

alter table "public"."questions" drop constraint "questions_form_id_fkey";

alter table "public"."scholarship_applications" drop constraint "scholarship_applications_scholarship_id_fkey";

alter table "public"."scholarship_applications" drop constraint "scholarship_applications_student_id_fkey";

alter table "public"."staff_accounts" drop constraint "staff_accounts_department_fkey";

alter table "public"."students" drop constraint "students_course_fkey";

alter table "public"."students" drop constraint "students_department_fkey";

alter table "public"."submissions" drop constraint "fk_submissions_students";

alter table "public"."submissions" drop constraint "submissions_form_id_fkey";

alter table "public"."support_requests" drop constraint "support_requests_department_fkey";

alter table "public"."support_requests" drop constraint "support_requests_student_id_fkey";

drop function if exists "public"."increment_event_attendees"(e_id bigint);

alter table "public"."admission_schedules" alter column "id" set generated by default;

alter table "public"."admission_schedules" enable row level security;

alter table "public"."answers" alter column "id" set generated by default;

alter table "public"."answers" enable row level security;

alter table "public"."applications" enable row level security;

alter table "public"."audit_logs" alter column "id" set generated by default;

alter table "public"."audit_logs" enable row level security;

alter table "public"."counseling_requests" alter column "id" set generated by default;

alter table "public"."counseling_requests" enable row level security;

alter table "public"."courses" alter column "id" set generated by default;

alter table "public"."courses" enable row level security;

alter table "public"."departments" alter column "id" set generated by default;

alter table "public"."departments" enable row level security;

alter table "public"."enrolled_students" enable row level security;

alter table "public"."event_attendance" alter column "id" set generated by default;

alter table "public"."event_attendance" enable row level security;

alter table "public"."event_feedback" alter column "id" set generated by default;

alter table "public"."event_feedback" enable row level security;

alter table "public"."events" alter column "id" set generated by default;

alter table "public"."events" enable row level security;

alter table "public"."forms" alter column "id" set generated by default;

alter table "public"."forms" enable row level security;

alter table "public"."general_feedback" enable row level security;

alter table "public"."needs_assessments" alter column "id" set generated by default;

alter table "public"."needs_assessments" enable row level security;

alter table "public"."notifications" alter column "id" set generated by default;

alter table "public"."notifications" enable row level security;

alter table "public"."office_visit_reasons" alter column "id" set generated by default;

alter table "public"."office_visit_reasons" enable row level security;

alter table "public"."office_visits" alter column "id" set generated by default;

alter table "public"."office_visits" enable row level security;

alter table "public"."questions" alter column "id" set generated by default;

alter table "public"."questions" enable row level security;

alter table "public"."scholarship_applications" alter column "id" set generated by default;

alter table "public"."scholarship_applications" enable row level security;

alter table "public"."scholarships" alter column "id" set generated by default;

alter table "public"."scholarships" enable row level security;

alter table "public"."staff_accounts" alter column "id" set generated by default;

alter table "public"."staff_accounts" enable row level security;

alter table "public"."students" alter column "id" set generated by default;

alter table "public"."students" enable row level security;

alter table "public"."submissions" alter column "id" set generated by default;

alter table "public"."submissions" enable row level security;

alter table "public"."support_requests" alter column "id" set generated by default;

alter table "public"."support_requests" enable row level security;

CREATE UNIQUE INDEX enrolled_students_student_id_key ON public.enrolled_students USING btree (student_id);

CREATE UNIQUE INDEX event_attendance_event_id_student_id_key ON public.event_attendance USING btree (event_id, student_id);

CREATE INDEX idx_answers_question_id ON public.answers USING btree (question_id);

CREATE INDEX idx_answers_submission_id ON public.answers USING btree (submission_id);

CREATE INDEX idx_applications_reference_id ON public.applications USING btree (reference_id);

CREATE INDEX idx_event_attendance_department ON public.event_attendance USING btree (department);

CREATE INDEX idx_students_student_id ON public.students USING btree (student_id);

CREATE INDEX idx_submissions_form_id ON public.submissions USING btree (form_id);

CREATE UNIQUE INDEX scholarship_applications_scholarship_id_student_id_key ON public.scholarship_applications USING btree (scholarship_id, student_id);

alter table "public"."enrolled_students" add constraint "enrolled_students_student_id_key" UNIQUE using index "enrolled_students_student_id_key";

alter table "public"."event_attendance" add constraint "event_attendance_event_id_student_id_key" UNIQUE using index "event_attendance_event_id_student_id_key";

alter table "public"."scholarship_applications" add constraint "scholarship_applications_scholarship_id_student_id_key" UNIQUE using index "scholarship_applications_scholarship_id_student_id_key";

alter table "public"."answers" add constraint "answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_question_id_fkey";

alter table "public"."answers" add constraint "answers_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_submission_id_fkey";

alter table "public"."applications" add constraint "applications_alt_course_1_fkey" FOREIGN KEY (alt_course_1) REFERENCES public.courses(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."applications" validate constraint "applications_alt_course_1_fkey";

alter table "public"."applications" add constraint "applications_alt_course_2_fkey" FOREIGN KEY (alt_course_2) REFERENCES public.courses(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."applications" validate constraint "applications_alt_course_2_fkey";

alter table "public"."applications" add constraint "applications_priority_course_fkey" FOREIGN KEY (priority_course) REFERENCES public.courses(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."applications" validate constraint "applications_priority_course_fkey";

alter table "public"."applications" add constraint "applications_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."applications" validate constraint "applications_student_id_fkey";

alter table "public"."applications" add constraint "applications_test_date_fkey" FOREIGN KEY (test_date) REFERENCES public.admission_schedules(date) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."applications" validate constraint "applications_test_date_fkey";

alter table "public"."counseling_requests" add constraint "counseling_requests_department_fkey" FOREIGN KEY (department) REFERENCES public.departments(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."counseling_requests" validate constraint "counseling_requests_department_fkey";

alter table "public"."counseling_requests" add constraint "counseling_requests_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."counseling_requests" validate constraint "counseling_requests_student_id_fkey";

alter table "public"."enrolled_students" add constraint "enrolled_students_course_fkey" FOREIGN KEY (course) REFERENCES public.courses(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."enrolled_students" validate constraint "enrolled_students_course_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_department_fkey" FOREIGN KEY (department) REFERENCES public.departments(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_department_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_event_id_fkey";

alter table "public"."event_attendance" add constraint "event_attendance_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."event_attendance" validate constraint "event_attendance_student_id_fkey";

alter table "public"."event_feedback" add constraint "event_feedback_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_feedback" validate constraint "event_feedback_event_id_fkey";

alter table "public"."event_feedback" add constraint "event_feedback_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."event_feedback" validate constraint "event_feedback_student_id_fkey";

alter table "public"."needs_assessments" add constraint "fk_needs_assessments_students" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."needs_assessments" validate constraint "fk_needs_assessments_students";

alter table "public"."notifications" add constraint "notifications_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_student_id_fkey";

alter table "public"."office_visits" add constraint "office_visits_reason_fkey" FOREIGN KEY (reason) REFERENCES public.office_visit_reasons(reason) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."office_visits" validate constraint "office_visits_reason_fkey";

alter table "public"."office_visits" add constraint "office_visits_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."office_visits" validate constraint "office_visits_student_id_fkey";

alter table "public"."questions" add constraint "questions_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_form_id_fkey";

alter table "public"."scholarship_applications" add constraint "scholarship_applications_scholarship_id_fkey" FOREIGN KEY (scholarship_id) REFERENCES public.scholarships(id) ON DELETE CASCADE not valid;

alter table "public"."scholarship_applications" validate constraint "scholarship_applications_scholarship_id_fkey";

alter table "public"."scholarship_applications" add constraint "scholarship_applications_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."scholarship_applications" validate constraint "scholarship_applications_student_id_fkey";

alter table "public"."staff_accounts" add constraint "staff_accounts_department_fkey" FOREIGN KEY (department) REFERENCES public.departments(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."staff_accounts" validate constraint "staff_accounts_department_fkey";

alter table "public"."students" add constraint "students_course_fkey" FOREIGN KEY (course) REFERENCES public.courses(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."students" validate constraint "students_course_fkey";

alter table "public"."students" add constraint "students_department_fkey" FOREIGN KEY (department) REFERENCES public.departments(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."students" validate constraint "students_department_fkey";

alter table "public"."submissions" add constraint "fk_submissions_students" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."submissions" validate constraint "fk_submissions_students";

alter table "public"."submissions" add constraint "submissions_form_id_fkey" FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE CASCADE not valid;

alter table "public"."submissions" validate constraint "submissions_form_id_fkey";

alter table "public"."support_requests" add constraint "support_requests_department_fkey" FOREIGN KEY (department) REFERENCES public.departments(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."support_requests" validate constraint "support_requests_department_fkey";

alter table "public"."support_requests" add constraint "support_requests_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.students(student_id) ON DELETE CASCADE not valid;

alter table "public"."support_requests" validate constraint "support_requests_student_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_event_attendees(e_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.events
  SET attendees = COALESCE(attendees, 0) + 1
  WHERE id = e_id;
END;
$function$
;


  create policy "Public Access"
  on "public"."admission_schedules"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public read schedules"
  on "public"."admission_schedules"
  as permissive
  for select
  to public
using (true);



  create policy "Insert answers"
  on "public"."answers"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public Access"
  on "public"."answers"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Staff read all answers"
  on "public"."answers"
  as permissive
  for select
  to public
using (true);



  create policy "Allow delete for all"
  on "public"."applications"
  as permissive
  for delete
  to public
using (true);



  create policy "Anyone can apply"
  on "public"."applications"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable update access for all users"
  on "public"."applications"
  as permissive
  for update
  to public
using (true);



  create policy "Public Access"
  on "public"."applications"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public insert applications"
  on "public"."applications"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public read applications"
  on "public"."applications"
  as permissive
  for select
  to public
using (true);



  create policy "Public update applications"
  on "public"."applications"
  as permissive
  for update
  to public
using (true);



  create policy "Users can view own application"
  on "public"."applications"
  as permissive
  for select
  to public
using (true);



  create policy "Enable all access for audit_logs"
  on "public"."audit_logs"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."audit_logs"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Allow delete for all"
  on "public"."counseling_requests"
  as permissive
  for delete
  to public
using (true);



  create policy "Public Access"
  on "public"."counseling_requests"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public Access"
  on "public"."courses"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public read courses"
  on "public"."courses"
  as permissive
  for select
  to public
using (true);



  create policy "Public Access"
  on "public"."departments"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public read departments"
  on "public"."departments"
  as permissive
  for select
  to public
using (true);



  create policy "Allow delete for all"
  on "public"."enrolled_students"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert access for all users"
  on "public"."enrolled_students"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."enrolled_students"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update access for all users"
  on "public"."enrolled_students"
  as permissive
  for update
  to public
using (true);



  create policy "Public Access"
  on "public"."enrolled_students"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Allow delete for all"
  on "public"."event_attendance"
  as permissive
  for delete
  to public
using (true);



  create policy "Allow update for all"
  on "public"."event_attendance"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Enable insert access for all users"
  on "public"."event_attendance"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."event_attendance"
  as permissive
  for select
  to public
using (true);



  create policy "Public Access"
  on "public"."event_attendance"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Allow delete for all"
  on "public"."event_feedback"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert access for all users"
  on "public"."event_feedback"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."event_feedback"
  as permissive
  for select
  to public
using (true);



  create policy "Public Access"
  on "public"."event_feedback"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public Access"
  on "public"."events"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable all access for forms"
  on "public"."forms"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."forms"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Allow anon to insert general_feedback"
  on "public"."general_feedback"
  as permissive
  for insert
  to anon
with check (true);



  create policy "Allow anon to select general_feedback"
  on "public"."general_feedback"
  as permissive
  for select
  to anon
using (true);



  create policy "Service role full access"
  on "public"."general_feedback"
  as permissive
  for all
  to service_role
using (true)
with check (true);



  create policy "Students can insert feedback"
  on "public"."general_feedback"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Students can read own feedback"
  on "public"."general_feedback"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow delete for all"
  on "public"."needs_assessments"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable delete access for all users"
  on "public"."needs_assessments"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert access for all users"
  on "public"."needs_assessments"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."needs_assessments"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update access for all users"
  on "public"."needs_assessments"
  as permissive
  for update
  to public
using (true);



  create policy "Public Access"
  on "public"."needs_assessments"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable all access"
  on "public"."notifications"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public Access"
  on "public"."notifications"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable read access for all"
  on "public"."office_visit_reasons"
  as permissive
  for select
  to public
using (true);



  create policy "Enable write access for staff"
  on "public"."office_visit_reasons"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."office_visit_reasons"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable all access for office_visits"
  on "public"."office_visits"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."office_visits"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable all access for questions"
  on "public"."questions"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."questions"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable read/write for all"
  on "public"."scholarship_applications"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."scholarship_applications"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public Access"
  on "public"."scholarships"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Enable read access for all"
  on "public"."staff_accounts"
  as permissive
  for select
  to public
using (true);



  create policy "Enable write access for all"
  on "public"."staff_accounts"
  as permissive
  for all
  to public
using (true);



  create policy "Public Access"
  on "public"."staff_accounts"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Allow delete for all"
  on "public"."students"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert access for all users"
  on "public"."students"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable update access for all users"
  on "public"."students"
  as permissive
  for update
  to public
using (true);



  create policy "Public Access"
  on "public"."students"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Public insert students"
  on "public"."students"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public read students"
  on "public"."students"
  as permissive
  for select
  to public
using (true);



  create policy "Public update students"
  on "public"."students"
  as permissive
  for update
  to public
using (true);



  create policy "Insert submissions"
  on "public"."submissions"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public Access"
  on "public"."submissions"
  as permissive
  for all
  to public
using (true)
with check (true);



  create policy "Staff read all submissions"
  on "public"."submissions"
  as permissive
  for select
  to public
using (true);



  create policy "Enable delete access for all users"
  on "public"."support_requests"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert access for all users"
  on "public"."support_requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."support_requests"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update access for all users"
  on "public"."support_requests"
  as permissive
  for update
  to public
using (true);



  create policy "Public Access"
  on "public"."support_requests"
  as permissive
  for all
  to public
using (true)
with check (true);


drop policy "Allow profile picture update" on "storage"."objects";


  create policy "Allow profile picture update"
  on "storage"."objects"
  as permissive
  for update
  to anon, authenticated
using ((bucket_id = 'profile-pictures'::text));



