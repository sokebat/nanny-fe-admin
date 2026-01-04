import { PerkCard, PerkItem } from "./perk-card";

interface PerksListProps {
    perks: PerkItem[];
    onEdit?: (id: number) => void;
}

export function PerksList({ perks, onEdit }: PerksListProps) {
    if (perks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No perks available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {perks.map((perk) => (
                <PerkCard key={perk.id} perk={perk} onEdit={onEdit} />
            ))}
        </div>
    );
}
