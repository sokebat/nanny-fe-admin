"use client";

import { useState } from "react";
import { ListingsTable, ListingRequest } from "@/components/listings";
import { Pagination } from "@/components/shared/pagination";

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
                <h2 className="text-foreground text-4xl font-bold mb-8">
                    Product & Service Listing Request
                </h2>

                <ListingsTable listings={currentListings} onDelete={handleDelete} />

                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default Page;