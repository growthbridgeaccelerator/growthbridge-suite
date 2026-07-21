ALTER TABLE restaurant_reservations
ADD COLUMN account_id uuid,
ADD COLUMN table_id uuid,
ADD COLUMN reservation_number text,
ADD COLUMN customer_name text NOT NULL,
ADD COLUMN phone text,
ADD COLUMN email text,
ADD COLUMN guest_count integer DEFAULT 1,
ADD COLUMN reservation_date date NOT NULL,
ADD COLUMN reservation_time time NOT NULL,
ADD COLUMN status text DEFAULT 'booked',
ADD COLUMN special_request text,
ADD COLUMN updated_at timestamptz DEFAULT now();