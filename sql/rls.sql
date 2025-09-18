-- Enable RLS on users
alter table public.users enable row level security;

-- =====================================
-- SELECT: any authenticated user can read
-- =====================================
create policy users_select_authenticated
on public.users
for select
using (auth.role() = 'authenticated');

-- =====================================
-- INSERT: only admins
-- =====================================
create policy users_insert_admin
on public.users
for insert
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- =====================================
-- DELETE: only admins
-- =====================================
create policy users_delete_admin
on public.users
for delete
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- =====================================
-- UPDATE: only admins OR the row’s owner
-- =====================================
create policy users_update_admin_or_owner
on public.users
for update
using (
  -- Allow if this row belongs to the current auth user
  auth.uid() = auth_user_id

  -- Or if current auth user has ADMIN role
  or exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
)
with check (
  auth.uid() = auth_user_id
  or exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

alter table public.users_role enable row level security;

-- Allow authenticated users to read
create policy users_role_select_authenticated
on public.users_role
for select
using (auth.role() = 'authenticated');

-- Allow only admins to insert
create policy users_role_insert_admin
on public.users_role
for insert
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- Allow only admins to update
create policy users_role_update_admin
on public.users_role
for update
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- Allow only admins to delete
create policy users_role_delete_admin
on public.users_role
for delete
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- Enable RLS on station
alter table public.station enable row level security;

-- =====================================
-- SELECT: any authenticated user
-- =====================================
create policy station_select_authenticated
on public.station
for select
using (auth.role() = 'authenticated');

-- =====================================
-- INSERT: only ADMIN
-- =====================================
create policy station_insert_admin
on public.station
for insert
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- =====================================
-- UPDATE: only ADMIN
-- =====================================
create policy station_update_admin
on public.station
for update
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- =====================================
-- DELETE: only ADMIN
-- =====================================
create policy station_delete_admin
on public.station
for delete
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- Enable RLS on partner_station
alter table public.partner_station enable row level security;

-- =====================================
-- SELECT: any authenticated user
-- =====================================
create policy partner_station_select_authenticated
on public.partner_station
for select
using (auth.role() = 'authenticated');

-- =====================================
-- INSERT: user must be ADMIN or PARTNER
-- =====================================
create policy partner_station_insert_admin_or_partner
on public.partner_station
for insert
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role in ('ADMIN', 'PARTNER')
  )
);

-- =====================================
-- UPDATE: ADMIN can update any, PARTNER only if owner
-- =====================================
create policy partner_station_update_admin_or_owner
on public.partner_station
for update
using (
  -- ADMIN can update any row
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
  -- PARTNER can update only their own row
  or (
    exists (
      select 1
      from public.users_role ur
      join public.users u on ur.auth_user_id = u.auth_user_id
      where ur.auth_user_id = auth.uid()
      and ur.role = 'PARTNER'
      and u.id = partner_station.user_id
    )
  )
)
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
  or (
    exists (
      select 1
      from public.users_role ur
      join public.users u on ur.auth_user_id = u.auth_user_id
      where ur.auth_user_id = auth.uid()
      and ur.role = 'PARTNER'
      and u.id = partner_station.user_id
    )
  )
);

-- =====================================
-- DELETE: only ADMIN
-- =====================================
create policy partner_station_delete_admin
on public.partner_station
for delete
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- Enable RLS on scooter
alter table public.scooter enable row level security;

-- =====================================
-- SELECT: any authenticated user
-- =====================================
create policy scooter_select_authenticated
on public.scooter
for select
using (auth.role() = 'authenticated');

-- =====================================
-- INSERT: only ADMIN
-- =====================================
create policy scooter_insert_admin
on public.scooter
for insert
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- =====================================
-- UPDATE: only ADMIN
-- =====================================
create policy scooter_update_admin
on public.scooter
for update
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- =====================================
-- DELETE: only ADMIN
-- =====================================
create policy scooter_delete_admin
on public.scooter
for delete
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
    and ur.role = 'ADMIN'
  )
);

-- Enable RLS on rental_history
alter table public.rental_history enable row level security;

-- =====================================
-- SELECT: owner OR ADMIN
-- =====================================
create policy rental_history_select_owner_or_admin
on public.rental_history
for select
using (
  -- Owner can select
  exists (
    select 1
    from public.users u
    where u.id = rental_history.user_id
      and u.auth_user_id = auth.uid()
  )
  -- OR ADMIN can select
  or exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
      and ur.role = 'ADMIN'
  )
);

-- =====================================
-- INSERT: only ADMIN
-- =====================================
create policy rental_history_insert_admin
on public.rental_history
for insert
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
      and ur.role = 'ADMIN'
  )
);

-- =====================================
-- UPDATE: only ADMIN
-- =====================================
create policy rental_history_update_admin
on public.rental_history
for update
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
      and ur.role = 'ADMIN'
  )
)
with check (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
      and ur.role = 'ADMIN'
  )
);

-- =====================================
-- DELETE: only ADMIN
-- =====================================
create policy rental_history_delete_admin
on public.rental_history
for delete
using (
  exists (
    select 1
    from public.users_role ur
    where ur.auth_user_id = auth.uid()
      and ur.role = 'ADMIN'
  )
);