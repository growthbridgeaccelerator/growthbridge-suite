-- ===========================================================
-- GrowthBridge Restaurant OS
-- Module 2 : RLS Policies
-- ===========================================================

----------------------------------------------------------
-- ENABLE RLS
----------------------------------------------------------

ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

----------------------------------------------------------
-- RESTAURANT SETTINGS
----------------------------------------------------------

CREATE POLICY restaurant_settings_select
ON restaurant_settings
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY restaurant_settings_insert
ON restaurant_settings
FOR INSERT
WITH CHECK (is_account_member(account_id,'admin'));

CREATE POLICY restaurant_settings_update
ON restaurant_settings
FOR UPDATE
USING (is_account_member(account_id,'admin'));

CREATE POLICY restaurant_settings_delete
ON restaurant_settings
FOR DELETE
USING (is_account_member(account_id,'admin'));

----------------------------------------------------------
-- MENU CATEGORIES
----------------------------------------------------------

CREATE POLICY menu_categories_select
ON menu_categories
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY menu_categories_insert
ON menu_categories
FOR INSERT
WITH CHECK (is_account_member(account_id,'admin'));

CREATE POLICY menu_categories_update
ON menu_categories
FOR UPDATE
USING (is_account_member(account_id,'admin'));

CREATE POLICY menu_categories_delete
ON menu_categories
FOR DELETE
USING (is_account_member(account_id,'admin'));

----------------------------------------------------------
-- MENU ITEMS
----------------------------------------------------------

CREATE POLICY menu_items_select
ON menu_items
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY menu_items_insert
ON menu_items
FOR INSERT
WITH CHECK (is_account_member(account_id,'admin'));

CREATE POLICY menu_items_update
ON menu_items
FOR UPDATE
USING (is_account_member(account_id,'admin'));

CREATE POLICY menu_items_delete
ON menu_items
FOR DELETE
USING (is_account_member(account_id,'admin'));

----------------------------------------------------------
-- CUSTOMER CART
----------------------------------------------------------

CREATE POLICY customer_cart_select
ON customer_cart
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY customer_cart_insert
ON customer_cart
FOR INSERT
WITH CHECK (is_account_member(account_id,'agent'));

CREATE POLICY customer_cart_update
ON customer_cart
FOR UPDATE
USING (is_account_member(account_id,'agent'));

CREATE POLICY customer_cart_delete
ON customer_cart
FOR DELETE
USING (is_account_member(account_id,'agent'));

----------------------------------------------------------
-- ORDERS
----------------------------------------------------------

CREATE POLICY orders_select
ON orders
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY orders_insert
ON orders
FOR INSERT
WITH CHECK (is_account_member(account_id,'agent'));

CREATE POLICY orders_update
ON orders
FOR UPDATE
USING (is_account_member(account_id,'agent'));

CREATE POLICY orders_delete
ON orders
FOR DELETE
USING (is_account_member(account_id,'admin'));

----------------------------------------------------------
-- PAYMENTS
----------------------------------------------------------

CREATE POLICY payments_select
ON payments
FOR SELECT
USING (is_account_member(account_id));

CREATE POLICY payments_insert
ON payments
FOR INSERT
WITH CHECK (is_account_member(account_id,'agent'));

CREATE POLICY payments_update
ON payments
FOR UPDATE
USING (is_account_member(account_id,'agent'));

CREATE POLICY payments_delete
ON payments
FOR DELETE
USING (is_account_member(account_id,'admin'));

