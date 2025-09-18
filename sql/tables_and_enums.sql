-- Create enum for app roles
CREATE TYPE app_roles AS enum (
  'ADMIN',
  'DEFAULT_USER',
  'PARTNER'
);

-- Create enum for scooter status
CREATE TYPE scooter_status AS enum (
  'IS_AT_STATION',
  'IS_UNDER_WAY_TO_STATION',
  'IS_STORED_IN_DEPOT',
  'IS_UNDER_MAINTENANCE',
  'IS_UNDER_RECOVERY',
  'IS_MISSPLACED',
  'IS_LOST'
);

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid,
  username text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text,
  last_name text,
  address text,
  email text,
  phone text,
  is_partner boolean NOT NULL DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.users_role (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL,
  role public.app_roles NOT NULL DEFAULT 'DEFAULT_USER'::app_roles,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  CONSTRAINT users_role_pkey PRIMARY KEY (id),
  CONSTRAINT users_role_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id),
  CONSTRAINT users_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.station (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  filled_slot numeric NOT NULL,
  max_slots numeric NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL,
  is_open boolean NOT NULL DEFAULT false,
  CONSTRAINT station_pkey PRIMARY KEY (id)
);

CREATE TABLE public.partner_station (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  filled_slots numeric NOT NULL,
  max_slots numeric NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  is_open boolean NOT NULL DEFAULT false,
  CONSTRAINT partner_station_pkey PRIMARY KEY (id),
  CONSTRAINT partner_station_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.scooter (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference_number character varying,
  model text,
  current_location text NOT NULL,
  current_assigned_user uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  current_status public.scooter_status NOT NULL,
  current_station uuid,
  current_partner_station uuid,
  CONSTRAINT scooter_pkey PRIMARY KEY (id),
  CONSTRAINT scooter_current_assigned_user_fkey FOREIGN KEY (current_assigned_user) REFERENCES public.users(id),
  CONSTRAINT scooter_current_station_fkey FOREIGN KEY (current_station) REFERENCES public.station(id),
  CONSTRAINT scooter_current_partner_station_fkey FOREIGN KEY (current_partner_station) REFERENCES public.partner_station(id)
);

CREATE TABLE public.rental_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  start_location text NOT NULL,
  end_location text NOT NULL,
  scooter_id uuid,
  distance_travelled numeric NOT NULL,
  CONSTRAINT rental_history_pkey PRIMARY KEY (id),
  CONSTRAINT rental_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT rental_history_scooter_id_fkey FOREIGN KEY (scooter_id) REFERENCES public.scooter(id)
);