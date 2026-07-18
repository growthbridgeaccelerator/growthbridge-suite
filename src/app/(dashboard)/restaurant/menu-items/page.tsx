"use client";

import { useEffect, useState } from "react";

import MenuItemForm from "@/components/restaurant/MenuItemForm";
import MenuItemList from "@/components/restaurant/MenuItemList";

export default function MenuItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    setLoading(true);

    try {
      const res = await fetch("/api/restaurant/menu-items");
      const data = await res.json();

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
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
        <h1 className="text-3xl font-bold">
          🍽 Menu Items
        </h1>

        <p className="text-muted-foreground">
          Create and manage menu items.
        </p>
      </div>

      <MenuItemForm onSaved={loadItems} />

      {loading ? (
        <div className="rounded-xl border p-6">
          Loading...
        </div>
      ) : (
        <MenuItemList items={items} />
      )}

    </div>
  );
}