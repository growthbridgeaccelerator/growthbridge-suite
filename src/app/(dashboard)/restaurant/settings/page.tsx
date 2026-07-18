"use client";

import { useEffect, useState } from "react";

export default function RestaurantSettingsPage() {
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadRestaurant();
  }, []);

  const loadRestaurant = async () => {
    try {
      const res = await fetch("/api/restaurant/settings");

      if (!res.ok) return;

      const data = await res.json();

      setRestaurantName(data.restaurant_name || "");
      setPhone(data.whatsapp_number || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
    } catch (err) {
      console.error(err);
    }
  };

  const saveRestaurant = async () => {
    const res = await fetch("/api/restaurant/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_name: restaurantName,
        whatsapp_number: phone,
        email,
        address,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Restaurant settings saved successfully.");
      loadRestaurant();
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Restaurant Settings
        </h1>

        <p className="text-muted-foreground mt-2">
          Configure your restaurant information.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-6">
          Basic Information
        </h2>

        <div className="grid gap-4">

          <input
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Restaurant Name"
            className="border rounded-lg p-3 bg-transparent"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="border rounded-lg p-3 bg-transparent"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border rounded-lg p-3 bg-transparent"
          />

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Restaurant Address"
            className="border rounded-lg p-3 bg-transparent"
          />

          <button
            onClick={saveRestaurant}
            className="bg-purple-600 text-white rounded-lg px-6 py-3 w-fit"
          >
            Save Settings
          </button>

        </div>
      </div>
    </div>
  );
}