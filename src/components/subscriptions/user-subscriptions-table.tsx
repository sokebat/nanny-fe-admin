"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";


// Since Badge component might not exist in the project, I'll check first or use a simple div
// I'll check src/components/ui/badge.tsx first. Wait, I didn't see it in list_dir.
// I'll use a custom badge-like div.

interface UserSubscription {
    id: string;
    userName: string;
    userEmail: string;
    planName: string;
    status: "active" | "canceled" | "past_due";
    startDate: string;
    nextBilling: string;
}

const dummyUserSubscriptions: UserSubscription[] = [
    {
        id: "sub_1",
        userName: "Alice Johnson",
        userEmail: "alice@example.com",
        planName: "Premium Caregiver",
        status: "active",
        startDate: "2023-10-15",
        nextBilling: "2024-10-15",
    },
    {
        id: "sub_2",
        userName: "Bob Smith",
        userEmail: "bob@example.com",
        planName: "Basic Caregiver",
        status: "active",
        startDate: "2023-12-01",
        nextBilling: "2024-01-01",
    },
    {
        id: "sub_3",
        userName: "Charlie Brown",
        userEmail: "charlie@example.com",
        planName: "Family Starter",
        status: "past_due",
        startDate: "2023-11-20",
        nextBilling: "2023-12-20",
    },
];

export function UserSubscriptionsTable() {
    return (
        <Card className="border border-slate-200 overflow-hidden bg-white shadow-none">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="py-4 font-semibold text-slate-700">User</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-700">Plan</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-700">Start Date</TableHead>
                                <TableHead className="py-4 font-semibold text-slate-700">Next Billing</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyUserSubscriptions.map((sub) => (
                                <TableRow key={sub.id} className="border-slate-100 transition-colors">
                                    <TableCell className="py-4">
                                        <div>
                                            <p className="font-semibold text-slate-700">{sub.userName}</p>
                                            <p className="text-xs text-slate-400">{sub.userEmail}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-slate-600 font-medium">{sub.planName}</TableCell>
                                    <TableCell className="py-4">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-800' :
                                            sub.status === 'canceled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {sub.status.replace('_', ' ')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-slate-600">{sub.startDate}</TableCell>
                                    <TableCell className="py-4 text-slate-600">{sub.nextBilling}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
