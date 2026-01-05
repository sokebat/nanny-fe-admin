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
            <div className="text-center py-12 bg-white">
                <p className="text-muted-foreground">No listings found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="py-4 font-semibold text-slate-700">Date</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700">Vendor Name</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700">Location</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700">Service Request</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700">Email</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listings.map((listing) => (
                        <TableRow key={listing.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors">
                            <TableCell className="py-4">
                                <div className="text-sm font-medium text-slate-600">{listing.date}</div>
                                <div className="text-xs text-slate-400">{listing.time}</div>
                            </TableCell>
                            <TableCell className="py-4 text-slate-600">
                                {listing.vendorName}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600">
                                {listing.location}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600">
                                {listing.serviceRequest}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600">
                                {listing.email}
                            </TableCell>
                            <TableCell className="py-4">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${listing.status === "Approved"
                                        ? "bg-green-50 text-[#15803d]"
                                        : "bg-red-50 text-[#dc2626]"
                                        }`}
                                >
                                    {listing.status}
                                </span>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDelete?.(listing.id)}
                                    className="h-8 w-8 text-slate-400 hover:text-brand-navy hover:bg-slate-100"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
