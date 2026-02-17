"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlansTable } from "@/components/subscriptions/plans-table";
import { UserSubscriptionsTable } from "@/components/subscriptions/user-subscriptions-table";
import { useSession } from "next-auth/react";

export default function SubscriptionsPage() {
    const [activeTab, setActiveTab] = useState("plans");
    const { data: session } = useSession();

    const role = (session as any)?.user?.role as
        | "parent"
        | "nanny"
        | "vendor"
        | "admin"
        | "moderator"
        | undefined;

    const canEditPlans = role === "admin";

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            <div className="mb-8 max-w-7xl mx-auto">
                <h2 className="text-[#333] text-3xl md:text-4xl mb-4 font-bold">
                    Subscriptions
                </h2>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-8">
                        <TabsTrigger
                            value="plans"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-brand-orange data-[state=active]:bg-transparent data-[state=active]:text-brand-orange pb-3 px-8 text-base shadow-none transition-none"
                        >
                            Subscription Plans
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-brand-orange data-[state=active]:bg-transparent data-[state=active]:text-brand-orange pb-3 px-8 text-base shadow-none transition-none"
                        >
                            User Subscriptions
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                        <TabsContent value="plans" className="mt-0 outline-none">
                            <PlansTable canEdit={canEditPlans} />
                        </TabsContent>
                        <TabsContent value="users" className="mt-0 outline-none">
                            <UserSubscriptionsTable />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </main>
    );
}
