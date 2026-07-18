"use client";

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  menu_categories?: {
    name: string;
  };
};

type Props = {
  items: Item[];
};

export default function MenuItemList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border p-6">
        No menu items found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border p-5 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-lg">
              {item.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {item.menu_categories?.name}
            </p>

            <p className="text-sm mt-2">
              {item.description || "No description"}
            </p>
          </div>

          <div className="text-right space-y-2">

            <div className="font-bold text-xl">
              ₹{item.price}
            </div>

            <div>
              {item.is_veg ? "🥦 Veg" : "🍗 Non Veg"}
            </div>

            <div>
              {item.is_available ? (
                <span className="text-green-600">
                  Available
                </span>
              ) : (
                <span className="text-red-600">
                  Out of Stock
                </span>
              )}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}