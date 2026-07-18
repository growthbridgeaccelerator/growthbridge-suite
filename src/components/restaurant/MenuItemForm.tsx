"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Props = {
  onSaved?: () => void;
};

export default function MenuItemForm({ onSaved }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isVeg, setIsVeg] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

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

    const res = await fetch("/api/restaurant/menu-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category_id: categoryId,
        description,
        price: Number(price),
        is_veg: isVeg,
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

    alert("Menu Item Added");

    onSaved?.();
  }

  return (
    <div className="rounded-xl border p-6 space-y-4">

      <input
        className="border rounded-lg p-3 w-full"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="border rounded-lg p-3 w-full"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <textarea
        className="border rounded-lg p-3 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border rounded-lg p-3 w-full"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isVeg}
          onChange={(e) => setIsVeg(e.target.checked)}
        />
        Veg Item
      </label>

      <button
        onClick={saveItem}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg"
      >
        Save Menu Item
      </button>

    </div>
  );
}