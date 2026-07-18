-- =====================================================
-- NUKKAD DAHIBHALLA RESTAURANT MODULE
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

----------------------------------------------------------
-- MENU CATEGORIES
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

----------------------------------------------------------
-- MENU ITEMS
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_customizable BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

----------------------------------------------------------
-- CUSTOMER CART
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS customer_cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INTEGER DEFAULT 1,
    price NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

----------------------------------------------------------
-- ORDERS
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id),
    subtotal NUMERIC(10,2) DEFAULT 0,
    delivery_charge NUMERIC(10,2) DEFAULT 0,
    grand_total NUMERIC(10,2) DEFAULT 0,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    delivery_type TEXT,
    delivery_address TEXT,
    order_status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

----------------------------------------------------------
-- ORDER ITEMS
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INTEGER,
    price NUMERIC(10,2),
    subtotal NUMERIC(10,2)
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category
ON menu_items(category_id);

CREATE INDEX IF NOT EXISTS idx_cart_contact
ON customer_cart(contact_id);

CREATE INDEX IF NOT EXISTS idx_orders_contact
ON orders(contact_id);
