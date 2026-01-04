import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge, StatusType } from "@/components/shared/status-badge";

export interface ResourceItem {
    id: number;
    name: string;
    detail: string;
    location: string;
    price: string;
    status: StatusType;
}

interface ResourcesTableProps {
    resources: ResourceItem[];
}

export function ResourcesTable({ resources }: ResourcesTableProps) {
    if (resources.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Detail</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource.id}>
                            <TableCell className="font-medium text-foreground">
                                {resource.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {resource.detail}
                            </TableCell>
                            <TableCell className="text-foreground">{resource.location}</TableCell>
                            <TableCell className="text-foreground">{resource.price}</TableCell>
                            <TableCell>
                                <StatusBadge status={resource.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
