-- ===========================================================
-- GrowthBridge Restaurant OS
-- Module 3 : Updated At Triggers
-- ===========================================================

CREATE TRIGGER restaurant_settings_updated_at
BEFORE UPDATE ON restaurant_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER menu_categories_updated_at
BEFORE UPDATE ON menu_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER menu_items_updated_at
BEFORE UPDATE ON menu_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER customer_cart_updated_at
BEFORE UPDATE ON customer_cart
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
