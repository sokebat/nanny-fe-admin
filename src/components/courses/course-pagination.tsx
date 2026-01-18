import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CoursePaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    currentCount: number;
    hasPrev: boolean;
    hasNext: boolean;
    onPageChange: (page: number) => void;
}

export function CoursePagination({
    currentPage,
    totalPages,
    total,
    currentCount,
    hasPrev,
    hasNext,
    onPageChange,
}: CoursePaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground text-center">
                Showing {currentCount} of {total} courses (Page {currentPage} of {totalPages})
            </div>
            <div className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (hasPrev) onPageChange(currentPage - 1);
                                }}
                                className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = pageNum === currentPage;
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href="#"
                                        isActive={isActive}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(pageNum);
                                        }}
                                        className={
                                            isActive
                                                ? "bg-brand-navy text-white hover:bg-brand-navy hover:text-white"
                                                : "cursor-pointer"
                                        }
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (hasNext) onPageChange(currentPage + 1);
                                }}
                                className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

