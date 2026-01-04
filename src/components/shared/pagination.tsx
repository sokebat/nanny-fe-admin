import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the start
            if (currentPage <= 3) {
                endPage = maxVisiblePages - 1;
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - (maxVisiblePages - 2);
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push("...");
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="h-9 w-9"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-muted-foreground"
                        >
                            ...
                        </span>
                    );
                }

                const pageNumber = page as number;
                const isActive = pageNumber === currentPage;

                return (
                    <Button
                        key={pageNumber}
                        variant={isActive ? "default" : "outline"}
                        size="icon"
                        onClick={() => onPageChange(pageNumber)}
                        className={`h-9 w-9 ${isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : ""
                            }`}
                    >
                        {pageNumber}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="h-9 w-9"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
