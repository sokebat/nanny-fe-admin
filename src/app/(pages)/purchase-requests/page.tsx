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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PurchaseRequest {
    id: number;
    itemName: string;
    name: string;
    location: string;
    purchaseRequest: string;
    email: string;
}

const caregiverCourseData: PurchaseRequest[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    itemName: "Course Name",
    name: "Jacob Marks",
    location: "Corner street 46 London",
    purchaseRequest: i % 2 === 0 ? "$119/Year" : "$11.9/Month",
    email: "john@gmail.com",
}));

const familyResourceData: PurchaseRequest[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 11,
    itemName: "Resource Name",
    name: "Jacob Marks",
    location: "Corner street 46 London",
    purchaseRequest: i % 2 === 0 ? "$119/Year" : "$11.9/Month",
    email: "john@gmail.com",
}));

export default function PurchaseRequestPage() {
    const [requestTab, setRequestTab] = useState("caregiver");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const currentData = requestTab === "caregiver" ? caregiverCourseData : familyResourceData;
    const itemColumnLabel = requestTab === "caregiver" ? "Courses" : "Resource";

    const handleApprove = (id: number) => {
        console.log("Approve request:", id);
    };

    const handleReject = (id: number) => {
        console.log("Reject request:", id);
    };

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            <div className="mb-8">
                <h2 className="text-[#333] text-4xl mb-4" style={{ fontFamily: 'Righteous, sans-serif' }}>
                    Purchase Request
                </h2>

                <Tabs value={requestTab} onValueChange={setRequestTab} className="w-full">
                    <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-8">
                        <TabsTrigger
                            value="caregiver"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-brand-orange data-[state=active]:bg-transparent data-[state=active]:text-brand-orange pb-3 px-8 text-base [state=active]:shadow-none transition-none"
                        >
                            Caregiver
                        </TabsTrigger>
                        <TabsTrigger
                            value="family"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-brand-orange data-[state=active]:bg-transparent data-[state=active]:text-brand-orange pb-3 px-8 text-base shadow-none transition-none"
                        >
                            Family
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="py-4 font-semibold text-slate-700">{itemColumnLabel}</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Name</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Location</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Purchase Request</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700">Email</TableHead>
                                    <TableHead className="py-4 font-semibold text-slate-700 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.map((request) => (
                                    <TableRow key={request.id} className="border-slate-100 hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="py-4 font-medium text-slate-600">{request.itemName}</TableCell>
                                        <TableCell className="py-4 text-slate-600">{request.name}</TableCell>
                                        <TableCell className="py-4 text-slate-600">{request.location}</TableCell>
                                        <TableCell className="py-4 text-slate-600">{request.purchaseRequest}</TableCell>
                                        <TableCell className="py-4 text-slate-600">{request.email}</TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleApprove(request.id)}
                                                    className="text-[#15803d] hover:text-[#16a34a] hover:bg-[#f0fdf4] font-semibold h-8"
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleReject(request.id)}
                                                    className="text-[#dc2626] hover:text-[#ef4444] hover:bg-[#fef2f2] font-semibold h-8"
                                                >
                                                    Reject
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

            <div className="mt-8 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {[1, 2, 3, 4, 5].map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === page}
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                    className={currentPage === page ? "bg-brand-navy text-white hover:bg-brand-navy hover:text-white" : "cursor-pointer"}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {totalPages > 5 && (
                            <>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}
                                        className="cursor-pointer"
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </main>
    );
}
