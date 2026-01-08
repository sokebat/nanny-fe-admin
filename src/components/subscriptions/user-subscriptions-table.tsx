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
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSubscription } from "@/types/subscription";

export function UserSubscriptionsTable() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const {
        getSubscriptionsQuery: { data: response, isLoading }
    } = useUserSubscriptionsManagement({
        page,
        limit,
    });

    const subscriptions = response?.data;
    const meta = response?.meta;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
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
                                    <TableHead className="py-4 font-semibold text-slate-700">End Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscriptions?.map((sub: UserSubscription) => (
                                    <TableRow key={sub._id || sub.id} className="border-slate-100 transition-colors">
                                        <TableCell className="py-4">
                                            <div>
                                                <p className="font-semibold text-slate-700">{sub.user.name}</p>
                                                <p className="text-xs text-slate-400">{sub.user.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600 font-medium">
                                            <div>
                                                <p>{sub.plan.name}</p>
                                                <p className="text-[10px] text-slate-400 capitalize">{sub.billingCycle}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-800' :
                                                sub.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {sub.status.replace('_', ' ')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600">
                                            {new Date(sub.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600">
                                            {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {subscriptions?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                                            No subscriptions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing page {meta.page} of {meta.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            disabled={page === meta.totalPages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
