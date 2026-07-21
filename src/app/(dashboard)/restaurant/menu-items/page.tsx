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
async function handleDelete(id: string) {
  const ok = window.confirm("Are you sure you want to delete this menu item?");

  if (!ok) return;

  try {
    const res = await fetch(`/api/restaurant/menu-items/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete menu item");
    }

    loadItems();
  } catch (err) {
    console.error(err);
    alert("Failed to delete menu item.");
  }
}

async function handleToggle(
  item: MenuItem,
  updates: Partial<MenuItem>
) {
  const res = await fetch(`/api/restaurant/menu-items/${item.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      is_veg:
        updates.is_veg !== undefined
          ? updates.is_veg
          : item.is_veg,
      is_available:
        updates.is_available !== undefined
          ? updates.is_available
          : item.is_available,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update menu item");
  }

  loadItems();
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
  onDelete={handleDelete}
  onToggleVeg={(item) =>
    handleToggle(item, {
      is_veg: !item.is_veg,
    })
  }
  onToggleAvailability={(item) =>
    handleToggle(item, {
      is_available: !item.is_available,
    })
  }
/>
      )}
    </div>
  );
}