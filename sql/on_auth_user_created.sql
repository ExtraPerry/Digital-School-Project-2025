-- 1. Function to handle new auth user
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_user_id uuid;
begin
  -- Insert into users table with email/phone from auth.users
  insert into public.users (auth_user_id, email, phone, created_at, updated_at)
  values (new.id, new.email, new.phone, now(), now())
  returning id into new_user_id;

  -- Insert into users_role table
  insert into public.users_role (auth_user_id, user_id, role, created_at, updated_at)
  values (new.id, new_user_id, 'DEFAULT_USER', now(), now());

  return new;
end;
$$;

-- 2. Trigger on auth.users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();