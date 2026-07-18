"use client";

import { useEffect, useState } from "react";

export default function RestaurantCategoriesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/restaurant/categories");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const saveCategory = async () => {
    if (!name.trim()) {
      alert("Category name required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/restaurant/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
      } else {
        setName("");
        setDescription("");
        await loadCategories();
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Menu Categories
        </h1>

        <p className="text-muted-foreground mt-2">
          Create and manage menu categories.
        </p>
      </div>

      <div className="rounded-xl border p-6 space-y-4">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="border rounded-lg p-3 w-full bg-transparent"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border rounded-lg p-3 w-full bg-transparent"
        />

        <button
          onClick={saveCategory}
          disabled={loading}
          className="bg-purple-600 text-white rounded-lg px-6 py-3"
        >
          {loading ? "Saving..." : "Add Category"}
        </button>

      </div>

      <div className="rounded-xl border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Categories
        </h2>

        {categories.length === 0 ? (
          <p className="text-muted-foreground">
            No categories found.
          </p>
        ) : (
          <div className="space-y-3">
            {categories.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.description || "No description"}
                  </p>
                </div>

                <span className="text-xs text-green-500">
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}