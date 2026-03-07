-- Idempotent Neon schema setup for WAP.
-- Safe to run multiple times.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text,
  role text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  owner_id uuid not null,
  address text not null unique,
  capacity numeric not null,
  price_per_month numeric not null,
  facilities text not null default '',
  start_date timestamptz not null,
  end_date timestamptz not null,
  photos text not null default '',
  status text not null default 'available',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  owner_id uuid not null,
  warehouse_id uuid not null,
  warehouse_name text not null,
  booking_date timestamptz not null default now(),
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'pending',
  total_amount numeric not null,
  payment_status text not null default 'pending',
  storage_details text not null default '',
  created_at timestamptz not null default now()
);

-- Ensure columns exist for older/partial schemas.
alter table public.profiles
  add column if not exists password_hash text,
  add column if not exists role text,
  add column if not exists is_verified boolean,
  add column if not exists created_at timestamptz;

alter table public.warehouses
  add column if not exists owner_id uuid,
  add column if not exists status text,
  add column if not exists created_at timestamptz;

alter table public.bookings
  add column if not exists customer_id uuid,
  add column if not exists owner_id uuid,
  add column if not exists warehouse_id uuid,
  add column if not exists status text,
  add column if not exists payment_status text,
  add column if not exists storage_details text,
  add column if not exists created_at timestamptz;

-- Apply defaults for nullable legacy columns.
update public.profiles set is_verified = false where is_verified is null;
update public.profiles set created_at = now() where created_at is null;
update public.profiles set role = lower(btrim(role)) where role is not null;
update public.profiles set role = null where role is not null and role not in ('customer', 'owner', 'admin');

update public.warehouses set status = 'available' where status is null;
update public.warehouses set created_at = now() where created_at is null;

update public.bookings set status = 'pending' where status is null;
update public.bookings set payment_status = 'pending' where payment_status is null;
update public.bookings set storage_details = '' where storage_details is null;
update public.bookings set created_at = now() where created_at is null;

alter table public.profiles alter column role drop not null;
alter table public.profiles alter column role drop default;
alter table public.profiles alter column is_verified set default false;
alter table public.profiles alter column created_at set default now();

alter table public.warehouses alter column status set default 'available';
alter table public.warehouses alter column created_at set default now();

alter table public.bookings alter column booking_date set default now();
alter table public.bookings alter column status set default 'pending';
alter table public.bookings alter column payment_status set default 'pending';
alter table public.bookings alter column storage_details set default '';
alter table public.bookings alter column created_at set default now();

-- Ensure required relations (foreign keys) exist.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'warehouses_owner_id_fkey'
      and conrelid = 'public.warehouses'::regclass
  ) then
    alter table public.warehouses
      add constraint warehouses_owner_id_fkey
      foreign key (owner_id) references public.profiles(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_customer_id_fkey'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_customer_id_fkey
      foreign key (customer_id) references public.profiles(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_owner_id_fkey'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_owner_id_fkey
      foreign key (owner_id) references public.profiles(id) on delete cascade;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_warehouse_id_fkey'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_warehouse_id_fkey
      foreign key (warehouse_id) references public.warehouses(id) on delete cascade;
  end if;
end
$$;

create index if not exists profiles_email_idx on public.profiles (lower(email));
create index if not exists warehouses_owner_id_idx on public.warehouses (owner_id);
create index if not exists bookings_customer_id_idx on public.bookings (customer_id);
create index if not exists bookings_owner_id_idx on public.bookings (owner_id);
create index if not exists bookings_warehouse_id_idx on public.bookings (warehouse_id);
