"use client";
import { useState } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import PerkNotification from "@/components/dashboard/perk-notification";
import RevenueChart from "@/components/dashboard/revenue-chart";
import PurchaseChart from "@/components/dashboard/purchase-chart";
import RequestsTable from "@/components/dashboard/requests-table";

export default function Home() {
  const [showPerkNotification, setShowPerkNotification] = useState(true);

  return (
    <main className="flex-1 p-8 overflow-auto bg-muted">
      {/* Greeting & Perk Notification */}
      <div className="mb-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-foreground text-lg font-medium mb-2">Hello, Mark Jacobs</h2>
            <p className="text-muted-foreground text-sm">
              Here is your daily activities and applications
            </p>
          </div>

          {showPerkNotification && <PerkNotification onClose={() => setShowPerkNotification(false)} />}
        </div>

        {/* Stats Cards */}
        <StatsCards />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <RevenueChart />
        <PurchaseChart />
      </div>

      {/* Product & Service Listing Request Table */}
      <RequestsTable />
    </main>
  );
}
