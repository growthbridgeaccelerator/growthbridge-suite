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
  onDelete: () => void;
};

export default function MenuItemList({
  items,
  onEdit,
  onDelete,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
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
          className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.is_veg
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.is_veg ? "Veg" : "Non-Veg"}
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.is_available
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.is_available ? "Available" : "Out of Stock"}
                </span>
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