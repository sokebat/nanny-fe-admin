"use client";

import React from "react";
import { InvoicesTable } from "@/components/invoices/invoices-table";

export default function InvoicesPage() {
    return (
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 bg-muted ">
            <div className="mb-6 md:mb-8 w-full">
                <h2 className="text-[#333] text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 font-bold">
                    Invoices
                </h2>

                <div className="mt-4 sm:mt-6 md:mt-8 w-full">
                    <InvoicesTable />
                </div>
            </div>
        </main>
    );
}
