-- Generic function to set timestamps across multiple tables.
CREATE OR REPLACE FUNCTION public.set_table_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT events
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = NOW();
        NEW.updated_at = NOW();
    
    -- For UPDATE events
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
        
        -- Prevent changing created_at
        NEW.created_at = OLD.created_at;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users Table
CREATE OR REPLACE TRIGGER set_users_timestamps
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION set_table_timestamps();

-- Users Role Table
CREATE OR REPLACE TRIGGER set_users_role_timestamps
BEFORE INSERT OR UPDATE ON public.users_role
FOR EACH ROW
EXECUTE FUNCTION set_table_timestamps();

-- Station Table
CREATE OR REPLACE TRIGGER set_station_timestamps
BEFORE INSERT OR UPDATE ON public.station
FOR EACH ROW
EXECUTE FUNCTION set_table_timestamps();

-- Partner Station Table
CREATE OR REPLACE TRIGGER set_partner_station_timestamps
BEFORE INSERT OR UPDATE ON public.partner_station
FOR EACH ROW
EXECUTE FUNCTION set_table_timestamps();

-- Scooter Table
CREATE OR REPLACE TRIGGER set_scooter_timestamps
BEFORE INSERT OR UPDATE ON public.scooter
FOR EACH ROW
EXECUTE FUNCTION set_table_timestamps();

-- Rental History Table
CREATE OR REPLACE TRIGGER set_rental_history_timestamps
BEFORE INSERT OR UPDATE ON public.rental_history
FOR EACH ROW
EXECUTE FUNCTION set_table_timestamps();