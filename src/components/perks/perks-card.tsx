import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface PerkItem {
    id: number;
    name: string;
    accessDays: number;
    type: "course" | "resource";
    includedBenefits: string[];
    remainingBenefits: string[];
}

interface PerkCardProps {
    perk: PerkItem;
    onEdit?: (id: number) => void;
}

const getAccessBadgeColor = (days: number) => {
    switch (days) {
        case 30:
            return "bg-green-100 text-green-700";
        case 60:
            return "bg-orange-100 text-orange-700";
        case 90:
            return "bg-blue-100 text-blue-700";
        default:
            return "bg-muted text-muted-foreground";
    }
};

export function PerkCard({ perk, onEdit }: PerkCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <h3 className="text-foreground font-medium">{perk.name}</h3>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getAccessBadgeColor(
                            perk.accessDays
                        )}`}
                    >
                        {perk.accessDays} Days Access
                    </span>
                </div>
                <CardAction>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => onEdit?.(perk.id)}
                        className="bg-[#1f344e] hover:bg-[#2d4a6a] text-white"
                    >
                        Edit
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <h4 className="text-foreground font-medium mb-4">Perks and Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {/* Included Benefits - Left Column */}
                    <div className="space-y-3">
                        {perk.includedBenefits.slice(0, 3).map((benefit, index) => (
                            <div key={`included-left-${index}`} className="flex items-start gap-2">
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                </div>
                                <span className="text-sm text-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Included Benefits - Right Column */}
                    <div className="space-y-3">
                        {perk.includedBenefits.slice(3).map((benefit, index) => (
                            <div key={`included-right-${index}`} className="flex items-start gap-2">
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                </div>
                                <span className="text-sm text-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Remaining Section Header */}
                    <div className="col-span-1 md:col-span-2 mt-4 mb-2">
                        <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>

                    {/* Remaining Benefits - Left Column */}
                    <div className="space-y-3">
                        {perk.remainingBenefits.slice(0, 2).map((benefit, index) => (
                            <div key={`remaining-left-${index}`} className="flex items-start gap-2">
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                        <X className="w-4 h-4 text-red-500" />
                                    </div>
                                </div>
                                <span className="text-sm text-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Remaining Benefits - Right Column */}
                    <div className="space-y-3">
                        {perk.remainingBenefits.slice(2).map((benefit, index) => (
                            <div key={`remaining-right-${index}`} className="flex items-start gap-2">
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                        <X className="w-4 h-4 text-red-500" />
                                    </div>
                                </div>
                                <span className="text-sm text-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
