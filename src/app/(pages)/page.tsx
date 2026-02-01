"use client";
import StatsCards from "@/components/dashboard/stats-cards";
import { useState } from "react";

import PurchaseChart from "@/components/dashboard/purchase-chart";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const name = session?.user?.name;
  return (
    <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted/30">
      {/* Premium Greeting Section */}
      <div className="mb-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-border relative z-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold mb-3 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              Dashboard Overview
            </div>
            <h2 className="text-3xl font-bold text-brand-navy mb-2">
              Hello, <span className="text-brand-orange">{name || "Administrator"}</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Welcome back to your command center. Everything looks good and 4 new applications are waiting for your review.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Server Status</span>
              <span className="text-sm font-bold text-green-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                Operational
              </span>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block mx-2" />
            <div className="bg-brand-navy p-3 rounded-xl shadow-lg shadow-brand-navy/10">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-brand-navy/5 rounded-full blur-2xl z-0" />
      </div>

      <div className="mb-10">
        <StatsCards />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <RevenueChart />
        <PurchaseChart />
      </div>

      {/* Product & Service Listing Request Table */}
      {/* <RequestsTable /> */}
    </main>
  );
}
