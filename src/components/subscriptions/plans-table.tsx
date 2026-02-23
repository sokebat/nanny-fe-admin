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
import { Plus, Edit2, Trash2, CreditCard, Loader2, Eye } from "lucide-react";
import { PlanDialog } from "./plan-dialog";
import { DeletePlanDialog } from "./delete-plan-dialog";
import { useSubscriptionPlans } from "@/hooks/use-plans";
import { Plan, CreatePlanDto, UpdatePlanDto } from "@/types/subscription";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PlansTableProps = {
  canEdit?: boolean;
};

export function PlansTable({ canEdit = true }: PlansTableProps) {
  const {
    getPlansQuery: { data: plans, isLoading },
    createPlan: createPlanMutation,
    updatePlan: updatePlanMutation,
    deletePlan: deletePlanMutation,
    createStripePrice: createStripePriceMutation,
  } = useSubscriptionPlans();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>(undefined);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!canEdit) return;
    setEditingPlan(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (!canEdit) return;
    setDeletePlanId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePlanId || !canEdit) return;
    try {
      await deletePlanMutation.mutateAsync(deletePlanId);
      setDeletePlanId(null);
    } catch {
      // Error handled by hook
    }
  };

  const handleStripePrice = async (
    id: string,
    billingCycle: "monthly" | "yearly",
  ) => {
    if (!canEdit) return;
    await createStripePriceMutation.mutateAsync({ id, billingCycle });
  };

  const handleSave = async (data: any) => {
    if (!canEdit) return;
    if (editingPlan) {
      await updatePlanMutation.mutateAsync({
        id: editingPlan._id || editingPlan.id,
        data: data as UpdatePlanDto,
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
      {canEdit && (
        <div className="flex justify-end">
          <Button
            onClick={handleCreate}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      )}

      <Card className="border border-slate-200 overflow-hidden bg-white shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-1/4 py-4 font-semibold text-slate-700">
                    Plan Name
                  </TableHead>
                  <TableHead className="w-1/6 py-4 font-semibold text-slate-700">
                    Role
                  </TableHead>
                  <TableHead className="w-1/5 py-4 font-semibold text-slate-700">
                    Monthly
                  </TableHead>
                  <TableHead className="w-1/5 py-4 font-semibold text-slate-700">
                    Yearly
                  </TableHead>
                  <TableHead className="w-1/6 py-4 font-semibold text-slate-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans?.map((plan: Plan) => (
                  <TableRow
                    key={plan._id || plan.id}
                    className="border-slate-100 transition-colors"
                  >
                    <TableCell className="py-4 font-medium text-slate-600">
                      <div className="space-y-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="font-semibold truncate text-sm">
                              {plan.name}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{plan.name}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs text-slate-400 truncate">
                              {plan.description}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{plan.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-600 capitalize">
                      {plan.role}
                    </TableCell>
                    <TableCell className="py-4 text-slate-600">
                      <div className="space-y-1">
                        <p className="font-medium">${plan.pricingMonthly}</p>
                        {plan.stripePriceIdMonthly ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-mono truncate block max-w-full">
                                {plan.stripePriceIdMonthly}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{plan.stripePriceIdMonthly}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : canEdit ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-[10px] text-blue-600"
                            onClick={() =>
                              handleStripePrice(plan._id || plan.id, "monthly")
                            }
                            disabled={createStripePriceMutation.isPending}
                          >
                            Create Price
                          </Button>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            No Stripe price
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-600">
                      <div className="space-y-1">
                        <p className="font-medium">${plan.pricingYearly}</p>
                        {plan.stripePriceIdYearly ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-mono truncate block max-w-full">
                                {plan.stripePriceIdYearly}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{plan.stripePriceIdYearly}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : canEdit ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-[10px] text-blue-600"
                            onClick={() =>
                              handleStripePrice(plan._id || plan.id, "yearly")
                            }
                            disabled={createStripePriceMutation.isPending}
                          >
                            Create Price
                          </Button>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            No Stripe price
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canEdit ? (
                          <>
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
                              onClick={() =>
                                handleDeleteClick(plan._id || plan.id)
                              }
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              disabled={deletePlanMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Plan"
                            onClick={() => handleEdit(plan)}
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {plans?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-slate-400"
                    >
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
        isSubmitting={
          createPlanMutation.isPending || updatePlanMutation.isPending
        }
        readOnly={!canEdit}
      />

      {canEdit && (
        <DeletePlanDialog
          open={!!deletePlanId}
          onOpenChange={(open) => !open && setDeletePlanId(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={deletePlanMutation.isPending}
        />
      )}
    </div>
  );
}
