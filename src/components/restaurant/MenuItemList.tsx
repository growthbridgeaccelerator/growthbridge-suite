"use client";

type Item = {
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

type Props = {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;

  onToggleVeg: (item: Item) => void;
  onToggleAvailability: (item: Item) => void;
};

export default function MenuItemList({
  items,
  onEdit,
  onDelete,
  onToggleVeg,
  onToggleAvailability,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center">
        <h3 className="text-lg font-semibold">No Menu Items</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first menu item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <div className="flex flex-col gap-2">
  <button
    onClick={() => onEdit(item)}
    className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
  >
    Edit
  </button>
  <button
  onClick={() => onDelete(item.id)}
  className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
>
  Delete
</button>
</div>

                <button
  type="button"
  onClick={() => onToggleVeg(item)}
  className={`rounded-full px-2 py-1 text-xs font-medium ${
    item.is_veg
      ? "bg-green-900 text-green-300 border border-green-700"
      : "bg-red-900 text-red-300 border border-red-700"
  }`}
>
  {item.is_veg ? "✅ Veg" : "🍖 Non-Veg"}
</button>

                <button
  type="button"
  onClick={() => onToggleAvailability(item)}
  className={`rounded-full px-2 py-1 text-xs font-medium ${
    item.is_available
      ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
      : "bg-zinc-800 text-zinc-300 border border-zinc-600"
  }`}
>
  {item.is_available ? "🟢 Available" : "🔴 Out of Stock"}
</button>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {item.menu_categories?.name || "Uncategorized"}
              </p>

              <p className="mt-3 text-sm">
                {item.description || "No description available."}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold">
                ₹{item.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}