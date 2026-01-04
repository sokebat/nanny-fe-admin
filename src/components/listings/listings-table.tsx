import { Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface ListingRequest {
    id: number;
    date: string;
    time: string;
    vendorName: string;
    location: string;
    serviceRequest: string;
    email: string;
    status: "Approved" | "Rejected";
}

interface ListingsTableProps {
    listings: ListingRequest[];
    onDelete?: (id: number) => void;
}

export function ListingsTable({ listings, onDelete }: ListingsTableProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No listings found</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Service Request</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listings.map((listing) => (
                        <TableRow key={listing.id}>
                            <TableCell>
                                <div className="text-sm text-foreground">{listing.date}</div>
                                <div className="text-xs text-muted-foreground">{listing.time}</div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                                {listing.vendorName}
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                                {listing.location}
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                                {listing.serviceRequest}
                            </TableCell>
                            <TableCell className="text-sm text-foreground">
                                {listing.email}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`text-sm font-medium ${listing.status === "Approved"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {listing.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete?.(listing.id)}
                                    className="h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
