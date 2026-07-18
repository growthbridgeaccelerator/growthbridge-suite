import Link from "next/link";

export default function RestaurantPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          🍽️ Restaurant OS
        </h1>

        <p className="text-muted-foreground mt-2">
          Welcome to GrowthBridge Restaurant Operating System.
        </p>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Restaurant Settings */}
        <Link href="/restaurant/settings">
          <div className="rounded-xl border p-5 hover:bg-muted cursor-pointer transition">

            <h2 className="font-semibold">
              Restaurant Settings
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Configure restaurant information.
            </p>

          </div>
        </Link>

        {/* Menu Management */}
        <Link href="/restaurant/categories">
          <div className="rounded-xl border p-5 hover:bg-muted cursor-pointer transition">

            <h2 className="font-semibold">
              Menu Management
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Categories and menu items.
            </p>

          </div>
        </Link>

        {/* Orders */}
        <div className="rounded-xl border p-5">

          <h2 className="font-semibold">
            Orders
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            View customer orders.
          </p>

        </div>

        {/* Payments */}
        <div className="rounded-xl border p-5">

          <h2 className="font-semibold">
            Payments
          </h2>

          <p className="text-sm text-muted-foreground mt-2">
            Payment history.
          </p>

        </div>

      </div>

    </div>
  );
}