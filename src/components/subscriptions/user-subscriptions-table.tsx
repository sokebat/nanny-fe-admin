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
import { useUserSubscriptionsManagement } from "@/hooks/use-user-subscriptions";
import { Loader2, ChevronLeft, ChevronRight, User, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSubscription } from "@/types/subscription";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function UserSubscriptionsTable() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const {
        getSubscriptionsQuery: { data: response, isLoading, isError, error }
    } = useUserSubscriptionsManagement({
        page,
        limit,
    });

    const subscriptions = response?.subscriptions || [];
    const totalPages = response?.totalPages || 0;
    const total = response?.total || 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                <Loader2 className="w-10 h-10 animate-spin text-brand-navy mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium animate-pulse">Fetching subscriptions...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-24 bg-white rounded-2xl border border-red-100">
                <p className="text-destructive font-bold mb-4">
                    {error instanceof Error ? error.message : "Failed to load subscriptions"}
                </p>
                <Button
                    variant="outline"
                    className="rounded-xl px-6"
                >
                    Retry Connection
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-card shadow-none overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="py-4 font-semibold text-brand-navy">User Details</TableHead>
                            <TableHead className="py-4 font-semibold text-brand-navy">Plan Information</TableHead>
                            <TableHead className="py-4 font-semibold text-brand-navy">Status</TableHead>
                            <TableHead className="py-4 font-semibold text-brand-navy">Period</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscriptions.map((sub: UserSubscription) => (
                            <TableRow key={sub._id} className="group transition-colors hover:bg-muted/20">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 uppercase font-bold text-xs ring-1 ring-slate-200">
                                            {sub.userId.firstName[0]}{sub.userId.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-tight">
                                                {sub.userId.firstName} {sub.userId.lastName}
                                            </p>
                                            <p className="text-xs text-slate-500">{sub.userId.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-700 capitalize">{sub.planId.name}</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-500">
                                                {sub.billingCycle}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            {sub.billingCycle === 'yearly'
                                                ? `$${sub.planId.pricingYearly / 12}/mo billed annually`
                                                : `$${sub.planId.pricingMonthly}/mo`
                                            }
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize",
                                        sub.status === 'active'
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : sub.status === 'cancelled'
                                                ? "bg-red-50 text-red-700 border-red-200"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    )}>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            sub.status === 'active' ? "bg-green-500" : sub.status === 'cancelled' ? "bg-red-500" : "bg-yellow-500"
                                        )} />
                                        {sub.status.replace('_', ' ')}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                                            <span>{format(new Date(sub.currentPeriodStart), "MMM dd, yyyy")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                            <div className="w-3.5" />
                                            <span>Ends {format(new Date(sub.currentPeriodEnd), "MMM dd, yyyy")}</span>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {subscriptions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12">
                                    <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-400 font-medium italic">No active subscriptions found.</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{subscriptions.length}</span> of <span className="text-slate-900 font-bold">{total}</span> records
                    </p>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-400">
                            Page <span className="font-bold text-slate-700">{page}</span> of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-9 px-4 border-slate-200 shadow-none hover:bg-slate-50 hover:text-brand-navy transition-all"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1.5" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-9 px-4 border-slate-200 shadow-none hover:bg-slate-50 hover:text-brand-navy transition-all"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
