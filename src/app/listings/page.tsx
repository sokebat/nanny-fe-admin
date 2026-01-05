"use client";

import { useState } from "react";
import { ListingsTable, ListingRequest } from "@/components/listings";
import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const listingData: ListingRequest[] = [
        {
            id: 1,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Service name",
            email: "john@gmail.com",
            status: "Approved",
        },
        {
            id: 2,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Product name",
            email: "john@gmail.com",
            status: "Rejected",
        },
        {
            id: 3,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Service name",
            email: "john@gmail.com",
            status: "Rejected",
        },
        {
            id: 4,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Product name",
            email: "john@gmail.com",
            status: "Approved",
        },
        {
            id: 5,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Product name",
            email: "john@gmail.com",
            status: "Approved",
        },
        {
            id: 6,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Service name",
            email: "john@gmail.com",
            status: "Rejected",
        },
        {
            id: 7,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Service name",
            email: "john@gmail.com",
            status: "Approved",
        },
        {
            id: 8,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Service name",
            email: "john@gmail.com",
            status: "Rejected",
        },
        {
            id: 9,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Product name",
            email: "john@gmail.com",
            status: "Approved",
        },
        {
            id: 10,
            date: "Wed, 17 Dec 2022",
            time: "09:00:20 GMT",
            vendorName: "Jacob Marks",
            location: "Corner street 46 Lo...",
            serviceRequest: "Product name",
            email: "john@gmail.com",
            status: "Approved",
        },
    ];

    const handleDelete = (id: number) => {
        console.log("Delete listing:", id);
        // Add your delete logic here
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log("Current page:", page);
    };

    // Calculate pagination
    const totalPages = Math.ceil(listingData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentListings = listingData.slice(startIndex, endIndex);

    return (
        <main className="flex-1 p-8 overflow-auto bg-muted">
            <div className="mb-8">
                <h2 className="text-[#333] text-4xl mb-8" style={{ fontFamily: 'Righteous, sans-serif' }}>
                    Product & Service Listing Request
                </h2>

                <Card className="border-none shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <ListingsTable listings={currentListings} onDelete={handleDelete} />
                    </CardContent>
                </Card>

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <ShadcnPagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === i + 1}
                                            onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                            className={currentPage === i + 1 ? "bg-brand-navy text-white hover:bg-brand-navy hover:text-white" : "cursor-pointer"}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </ShadcnPagination>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Page;