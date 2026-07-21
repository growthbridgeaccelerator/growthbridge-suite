"use client";

import { useEffect, useState } from "react";

import MenuItemForm from "@/components/restaurant/MenuItemForm";
import MenuItemList from "@/components/restaurant/MenuItemList";

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  category_id: string;
  menu_categories?: {
    name: string;
  };
};

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  async function loadItems() {
    setLoading(true);

    try {
      const res = await fetch("/api/restaurant/menu-items");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">🍽 Menu Items</h1>

        <p className="text-muted-foreground">
          Create, edit and manage your restaurant menu.
        </p>
      </div>

      <MenuItemForm
        item={selectedItem}
        onSaved={() => {
          setSelectedItem(null);
          loadItems();
        }}
        onCancel={() => setSelectedItem(null)}
      />

      {loading ? (
        <div className="rounded-xl border p-6">
          Loading...
        </div>
      ) : (
        <MenuItemList
          items={items}
          onEdit={setSelectedItem}
          onDelete={loadItems}
        />
      )}
    </div>
  );
}