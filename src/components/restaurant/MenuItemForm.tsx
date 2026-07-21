"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/app/(dashboard)/restaurant/menu-items/page";

type Category = {
  id: string;
  name: string;
};

type Props = {
  item?: MenuItem | null;
  onSaved?: () => void;
  onCancel?: () => void;
};

export default function MenuItemForm({
  item,
  onSaved,
  onCancel,
}: Props): import("react/jsx-runtime").JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
  if (!item) return;

  setName(item.name);
  setCategoryId(item.category_id);
  setDescription(item.description ?? "");
  setPrice(String(item.price));
  setIsVeg(item.is_veg);
  setIsAvailable(item.is_available);
}, [item]);

  async function loadCategories() {
    const res = await fetch("/api/restaurant/categories");
    const data = await res.json();

    if (Array.isArray(data)) {
      setCategories(data);
    }
  }

  async function saveItem() {
  if (!name.trim()) {
    alert("Item name is required");
    return;
  }

  if (!categoryId) {
    alert("Please select a category");
    return;
  }

  setSaving(true);

  try {
    const url = item
      ? `/api/restaurant/menu-items/${item.id}`
      : "/api/restaurant/menu-items";

    const method = item ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category_id: categoryId,
        description,
        price: Number(price),
        is_veg: isVeg,
        is_available: isAvailable,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to save");
      return;
    }

    setName("");
    setCategoryId("");
    setDescription("");
    setPrice("");
    setIsVeg(true);
    setIsAvailable(true);

    alert(item ? "Menu Item Updated" : "Menu Item Added");

    onSaved?.();

  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setSaving(false);
  }
}
  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        {item ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Item Name</label>
        <input
          className="w-full rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="" className="bg-zinc-900 text-white">
  Select Category
</option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
              className="bg-zinc-900 text-white"
            >
               {cat.name}
</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          className="w-full rounded border px-3 py-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Price</label>
        <input
          type="number"
          className="w-full rounded border px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isVeg}
          onChange={(e) => setIsVeg(e.target.checked)}
        />
        Vegetarian
      </label>

       <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isAvailable}
    onChange={(e) => setIsAvailable(e.target.checked)}
  />
  Available
</label>

      <div className="flex gap-3">
        <button
          onClick={saveItem}
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : item
            ? "Update Item"
            : "Add Item"}
        </button>

        {item && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}