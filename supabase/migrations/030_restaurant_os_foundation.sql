-- ===========================================================
-- GrowthBridge Restaurant OS Foundation
-- Module 1 : Restaurant Settings
-- ===========================================================

CREATE TABLE IF NOT EXISTS restaurant_settings (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    created_by UUID
        REFERENCES profiles(id),

    restaurant_name TEXT NOT NULL,

    brand_name TEXT,

    description TEXT,

    logo_url TEXT,

    email TEXT,

    address TEXT,

    city TEXT,

    state TEXT,

    country TEXT,

    pincode TEXT,

    google_maps_url TEXT,

    opening_time TIME,

    closing_time TIME,

    whatsapp_number TEXT,

    support_number TEXT,

    upi_id TEXT,

    qr_image_url TEXT,

    currency TEXT DEFAULT 'INR',

    delivery_charge NUMERIC(10,2) DEFAULT 0,

    free_delivery_above NUMERIC(10,2),

    instagram_url TEXT,

    facebook_url TEXT,

    website_url TEXT,

    fssai_number TEXT,

    gst_number TEXT,

    order_prefix TEXT DEFAULT 'NDB',

    timezone TEXT DEFAULT 'Asia/Kolkata',

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS idx_restaurant_settings_account
ON restaurant_settings(account_id);
-- ===========================================================
-- Module 2 : Menu Categories
-- ===========================================================
CREATE TABLE IF NOT EXISTS menu_categories (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    created_by UUID
        REFERENCES profiles(id),

    name TEXT NOT NULL,

    description TEXT,

    image_url TEXT,

    display_order INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(account_id, name)

);

CREATE INDEX IF NOT EXISTS idx_menu_categories_account
ON menu_categories(account_id);

CREATE INDEX IF NOT EXISTS idx_menu_categories_order
ON menu_categories(display_order);
-- ===========================================================
-- Module 3 : Menu Items
-- ===========================================================

CREATE TABLE IF NOT EXISTS menu_items (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    category_id UUID NOT NULL
        REFERENCES menu_categories(id)
        ON DELETE CASCADE,

    created_by UUID
        REFERENCES profiles(id),

    name TEXT NOT NULL,

    item_code TEXT NOT NULL,
    sku TEXT,

    description TEXT,

    price NUMERIC(10,2) NOT NULL,

    preparation_time INTEGER DEFAULT 15,

    image_url TEXT,

    food_type TEXT DEFAULT 'veg',

    spice_level TEXT,

    serving_size TEXT,

    calories INTEGER,

    is_veg BOOLEAN DEFAULT TRUE,

    is_available BOOLEAN DEFAULT TRUE,

    is_customizable BOOLEAN DEFAULT TRUE,

    display_order INTEGER DEFAULT 0,

    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(account_id, category_id, name)

);

CREATE INDEX IF NOT EXISTS idx_menu_items_account
ON menu_items(account_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_category
ON menu_items(category_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_available
ON menu_items(is_available);

-- ===========================================================
-- Module 4 : Customer Cart
-- ===========================================================

CREATE TABLE IF NOT EXISTS customer_cart (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    contact_id UUID NOT NULL
        REFERENCES contacts(id)
        ON DELETE CASCADE,

    conversation_id UUID
        REFERENCES conversations(id)
        ON DELETE SET NULL,

    menu_item_id UUID NOT NULL
        REFERENCES menu_items(id)
        ON DELETE CASCADE,

    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

    unit_price NUMERIC(10,2) NOT NULL,

    line_total NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS idx_customer_cart_contact
ON customer_cart(contact_id);

CREATE INDEX IF NOT EXISTS idx_customer_cart_conversation
ON customer_cart(conversation_id);

-- ===========================================================
-- Module 5 : Orders
-- ===========================================================

CREATE TABLE IF NOT EXISTS orders (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    contact_id UUID NOT NULL
        REFERENCES contacts(id)
        ON DELETE RESTRICT,

    conversation_id UUID
        REFERENCES conversations(id)
        ON DELETE SET NULL,

    order_number TEXT NOT NULL,

    customer_name TEXT NOT NULL,

    customer_phone TEXT NOT NULL,

    order_type TEXT NOT NULL DEFAULT 'delivery',

    payment_method TEXT NOT NULL DEFAULT 'upi',

    payment_status TEXT NOT NULL DEFAULT 'pending',

    order_status TEXT NOT NULL DEFAULT 'new',

    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,

    delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0,

    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,

    grand_total NUMERIC(10,2) NOT NULL DEFAULT 0,

    delivery_address TEXT,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(account_id, order_number)
);

CREATE INDEX IF NOT EXISTS idx_orders_account
ON orders(account_id);

CREATE INDEX IF NOT EXISTS idx_orders_contact
ON orders(contact_id);

CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders(order_status);

-- ===========================================================
-- Module 6 : Order Items
-- ===========================================================

CREATE TABLE IF NOT EXISTS order_items (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    order_id UUID NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    menu_item_id UUID NOT NULL
        REFERENCES menu_items(id)
        ON DELETE RESTRICT,

    item_name TEXT NOT NULL,

    item_code TEXT,

    quantity INTEGER NOT NULL CHECK (quantity > 0),

    unit_price NUMERIC(10,2) NOT NULL,

    subtotal NUMERIC(10,2) NOT NULL,

    special_instructions TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS idx_order_items_order
ON order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_order_items_account
ON order_items(account_id);

CREATE INDEX IF NOT EXISTS idx_order_items_menu
ON order_items(menu_item_id);

-- ===========================================================
-- Module 7 : Payments
-- ===========================================================

CREATE TABLE IF NOT EXISTS payments (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
        REFERENCES accounts(id)
        ON DELETE CASCADE,

    order_id UUID NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    payment_reference TEXT,

    payment_method TEXT NOT NULL,

    payment_status TEXT NOT NULL DEFAULT 'pending',

    amount NUMERIC(10,2) NOT NULL,

    transaction_id TEXT,

    upi_transaction_id TEXT,

    payment_gateway TEXT,

    gateway_response JSONB,

    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS idx_payments_order
ON payments(order_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
ON payments(payment_status);

----------------------------------------------------------
-- ORDER ITEMS
----------------------------------------------------------

CREATE POLICY order_items_select
ON order_items
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY order_items_insert
ON order_items
FOR INSERT
WITH CHECK (is_account_member(account_id,'agent'));

CREATE POLICY order_items_update
ON order_items
FOR UPDATE
USING (is_account_member(account_id,'agent'));

CREATE POLICY order_items_delete
ON order_items
FOR DELETE
USING (is_account_member(account_id,'admin'));
