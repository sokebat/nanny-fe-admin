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
import { Plus, Edit2, Trash2, CreditCard } from "lucide-react";
import { PlanDialog } from "./plan-dialog";


interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: "month" | "year";
    stripePriceId?: string;
}

const dummyPlans: Plan[] = [
    {
        id: "1",
        name: "Basic Caregiver",
        description: "Essential features for caregivers",
        price: 19.99,
        interval: "month",
        stripePriceId: "price_123",
    },
    {
        id: "2",
        name: "Premium Caregiver",
        description: "Advanced features and priority support",
        price: 199.99,
        interval: "year",
        stripePriceId: "price_456",
    },
    {
        id: "3",
        name: "Family Starter",
        description: "Basic features for families",
        price: 29.99,
        interval: "month",
    },
];

export function PlansTable() {
    const [plans, setPlans] = useState<Plan[]>(dummyPlans);
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

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this plan?")) {
            setPlans(plans.filter((p) => p.id !== id));
        }
    };

    const handleStripePrice = (id: string) => {
        console.log("Creating Stripe price for plan:", id);
        alert("Stripe price creation initiated for plan " + id);
    };

    const handleSave = (data: Partial<Plan>) => {
        if (editingPlan) {
            setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...data } as Plan : p));
        } else {
            const newPlan: Plan = {
                id: Math.random().toString(36).substr(2, 9),
                name: data.name || "",
                description: data.description || "",
                price: data.price || 0,
                interval: data.interval || "month",
                ...data
            };
            setPlans([...plans, newPlan]);
        }
        setIsDialogOpen(false);
    };

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
                                    <TableHead className="py-4 font-semibold text-slate-700">Price</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Interval</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Stripe ID</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id} className="border-slate-100 transition-colors">
                                        <TableCell className="py-4 font-medium text-slate-600">
                                            <div>
                                                <p className="font-semibold">{plan.name}</p>
                                                <p className="text-xs text-slate-400">{plan.description}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-600">${plan.price}</TableCell>
                                        <TableCell className="py-4 text-slate-600 capitalize">{plan.interval}</TableCell>
                                        <TableCell className="py-4 text-slate-600">
                                            {plan.stripePriceId ? (
                                                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-mono">
                                                    {plan.stripePriceId}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Not set</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!plan.stripePriceId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Create Stripe Price"
                                                        onClick={() => handleStripePrice(plan.id)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                    </Button>
                                                )}
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
                                                    onClick={() => handleDelete(plan.id)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
