-- Unique constraint auf user_id für upsert in der App
alter table public.life_inputs add constraint life_inputs_user_id_key unique (user_id);
