import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plan, CreatePlanDto, UpdatePlanDto, UserRole } from "@/types/subscription";

interface PlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: CreatePlanDto | UpdatePlanDto) => void;
    plan?: Plan;
}

export function PlanDialog({ open, onOpenChange, onSave, plan }: PlanDialogProps) {
    const [formData, setFormData] = useState<Partial<CreatePlanDto>>({
        name: "",
        role: "caregiver",
        description: "",
        pricingMonthly: 0,
        pricingYearly: 0,
        features: [],
        isActive: true,
        isPopular: false,
    });

    const [featuresText, setFeaturesText] = useState("");

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                role: plan.role,
                description: plan.description,
                pricingMonthly: plan.pricingMonthly,
                pricingYearly: plan.pricingYearly,
                features: plan.features,
                isActive: plan.isActive,
                isPopular: plan.isPopular,
            });
            setFeaturesText(plan.features.join("\n"));
        } else {
            setFormData({
                name: "",
                role: "caregiver",
                description: "",
                pricingMonthly: 0,
                pricingYearly: 0,
                features: [],
                isActive: true,
                isPopular: false,
            });
            setFeaturesText("");
        }
    }, [plan, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const features = featuresText.split("\n").map(f => f.trim()).filter(f => f !== "");
        onSave({ ...formData, features } as CreatePlanDto);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{plan ? "Edit Plan" : "Create Plan"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Basic Caregiver Plan"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: UserRole) =>
                                setFormData({ ...formData, role: value })
                            }
                        >
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="caregiver">Caregiver</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of the plan"
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pricingMonthly">Monthly Price ($)</Label>
                            <Input
                                id="pricingMonthly"
                                type="number"
                                step="0.01"
                                value={formData.pricingMonthly}
                                onChange={(e) => setFormData({ ...formData, pricingMonthly: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pricingYearly">Yearly Price ($)</Label>
                            <Input
                                id="pricingYearly"
                                type="number"
                                step="0.01"
                                value={formData.pricingYearly}
                                onChange={(e) => setFormData({ ...formData, pricingYearly: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="features">Features (one per line)</Label>
                        <Textarea
                            id="features"
                            value={featuresText}
                            onChange={(e) => setFeaturesText(e.target.value)}
                            placeholder="Messaging&#10;Job Applications&#10;Priority Support"
                            rows={4}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPopular"
                                checked={formData.isPopular}
                                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                className="w-4 h-4 text-brand-orange border-slate-300 rounded focus:ring-brand-orange"
                            />
                            <Label htmlFor="isPopular">Popular Plan</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-brand-orange border-slate-300 rounded focus:ring-brand-orange"
                            />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-brand-orange hover:bg-brand-orange-hover text-white">
                        {plan ? "Save Changes" : "Create Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

