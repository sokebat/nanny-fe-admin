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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Trash2, CreditCard, Loader2 } from "lucide-react";
import { PlanDialog } from "./plan-dialog";
import { useSubscriptionPlans } from "@/hooks/use-plans";
import { Plan, CreatePlanDto, UpdatePlanDto } from "@/types/subscription";

export function PlansTable() {
    const {
        getPlansQuery: { data: plans, isLoading },
        createPlan: createPlanMutation,
        updatePlan: updatePlanMutation,
        deletePlan: deletePlanMutation,
        createStripePrice: createStripePriceMutation
    } = useSubscriptionPlans();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | undefined>(undefined);


    const handleCreate = () => {
        setEditingPlan(undefined);
        setIsDialogOpen(true);
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this plan?")) {
            await deletePlanMutation.mutateAsync(id);
        }
    };

    const handleStripePrice = async (id: string, billingCycle: "monthly" | "yearly") => {
        await createStripePriceMutation.mutateAsync({ id, billingCycle });
    };

    const handleSave = async (data: any) => {
        if (editingPlan) {
            await updatePlanMutation.mutateAsync({
                id: editingPlan._id || editingPlan.id,
                data: data as UpdatePlanDto
            });
        } else {
            await createPlanMutation.mutateAsync(data as CreatePlanDto);
        }
        setIsDialogOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleCreate} className="bg-brand-orange hover:bg-brand-orange-hover text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Plan
                </Button>
            </div>

            <Card className="border border-slate-200 overflow-hidden bg-white shadow-none">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="py-4 font-semibold text-slate-700">Plan Name</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Role</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Monthly</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Yearly</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans?.map((plan: Plan) => (
                                    <TableRow key={plan._id || plan.id} className="border-slate-100 transition-colors">
                                        <TableCell className="py-4 font-medium text-slate-600">
                                            <div>
                                                <p className="font-semibold">{plan.name}</p>
                                                <p className="text-xs text-slate-400">{plan.description}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600 capitalize">{plan.role}</TableCell>
                                        <TableCell className="py-4 text-slate-600">
                                            <div>
                                                <p>${plan.pricingMonthly}</p>
                                                {plan.stripePriceIdMonthly ? (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-mono">
                                                        {plan.stripePriceIdMonthly}
                                                    </span>
                                                ) : (
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="h-auto p-0 text-[10px] text-blue-600"
                                                        onClick={() => handleStripePrice(plan._id || plan.id, "monthly")}
                                                        disabled={createStripePriceMutation.isPending}
                                                    >
                                                        Create Price
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600">
                                            <div>
                                                <p>${plan.pricingYearly}</p>
                                                {plan.stripePriceIdYearly ? (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-mono">
                                                        {plan.stripePriceIdYearly}
                                                    </span>
                                                ) : (
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="h-auto p-0 text-[10px] text-blue-600"
                                                        onClick={() => handleStripePrice(plan._id || plan.id, "yearly")}
                                                        disabled={createStripePriceMutation.isPending}
                                                    >
                                                        Create Price
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit Plan"
                                                    onClick={() => handleEdit(plan)}
                                                    className="text-brand-navy hover:text-brand-navy/80 hover:bg-slate-100"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete Plan"
                                                    onClick={() => handleDelete(plan._id || plan.id)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    disabled={deletePlanMutation.isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {plans?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                                            No plans found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <PlanDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleSave}
                plan={editingPlan}
            />
        </div>
    );
}

