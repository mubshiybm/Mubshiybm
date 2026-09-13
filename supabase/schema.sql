-- Run this in Supabase SQL Editor.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room text not null default 'mh-private',
  sender text not null check (sender in ('me', 'her')),
  body text check (char_length(body) between 1 and 500),
  voice_path text,
  created_at timestamptz not null default now(),
  constraint message_has_content check (body is not null or voice_path is not null)
);

alter table public.messages enable row level security;

-- Replace this temporary room policy with Supabase Auth user policies before publishing.
-- The two approved accounts are: mubshiybm@gmail.com and haleemah@gmail.com.
-- Production policies should check auth.jwt() ->> 'email' against this allowlist.
create policy "private room can read" on public.messages for select using (room = 'mh-private');
create policy "private room can send" on public.messages for insert with check (room = 'mh-private');

alter publication supabase_realtime add table public.messages;

insert into storage.buckets (id, name, public) values ('voice-notes', 'voice-notes', false) on conflict (id) do nothing;
create policy "voice notes can be read" on storage.objects for select using (bucket_id = 'voice-notes');
create policy "voice notes can be uploaded" on storage.objects for insert with check (bucket_id = 'voice-notes');
