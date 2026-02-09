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

interface ListingTableProps {
    listings: ListingRequest[];
    onDelete?: (id: number) => void;
}

export function ListingTable({ listings, onDelete }: ListingTableProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-12 rounded-xl border border-slate-200 bg-white   border-dashed">
                <p className="text-muted-foreground">No listings found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                        <TableHead className="py-4 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">Date</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">Vendor Name</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">Location</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">Service Request</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">Email</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 border-r border-slate-200 last:border-r-0">Status</TableHead>
                        <TableHead className="py-4 font-semibold text-slate-700 text-right border-r-0">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listings.map((listing) => (
                        <TableRow key={listing.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-b-0">
                            <TableCell className="py-4 border-r border-slate-100 last:border-r-0">
                                <div className="text-sm font-medium text-slate-600">{listing.date}</div>
                                <div className="text-xs text-slate-400">{listing.time}</div>
                            </TableCell>
                            <TableCell className="py-4 text-slate-600 border-r border-slate-100 last:border-r-0">
                                {listing.vendorName}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600 border-r border-slate-100 last:border-r-0">
                                {listing.location}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600 border-r border-slate-100 last:border-r-0">
                                {listing.serviceRequest}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600 border-r border-slate-100 last:border-r-0">
                                {listing.email}
                            </TableCell>
                            <TableCell className="py-4 border-r border-slate-100 last:border-r-0">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${listing.status === "Approved"
                                        ? "bg-green-50 text-[#15803d]"
                                        : "bg-red-50 text-[#dc2626]"
                                        }`}
                                >
                                    {listing.status}
                                </span>
                            </TableCell>
                            <TableCell className="py-4 text-right border-r-0">
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
