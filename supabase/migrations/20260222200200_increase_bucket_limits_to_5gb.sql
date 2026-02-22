-- Increase storage bucket file size limits to 5 GiB (5,368,709,120 bytes).

update storage.buckets
set file_size_limit = 5368709120
where id in ('profile-pictures', 'support_documents', 'attendance_proofs');
