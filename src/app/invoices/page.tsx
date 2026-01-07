"use client";

import React from "react";
import { InvoicesTable } from "@/components/invoices/invoices-table";

export default function InvoicesPage() {
    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            <div className="mb-8">
                <h2 className="text-[#333] text-4xl mb-4 font-bold">
                    Invoices
                </h2>

                <div className="mt-8">
                    <InvoicesTable />
                </div>
            </div>
        </main>
    );
}
