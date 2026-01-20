import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ResourcePaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    currentCount: number;
    onPageChange: (page: number) => void;
    hasNext: boolean;
    hasPrev: boolean;
}

export function ResourcePagination({
    currentPage,
    totalPages,
    total,
    currentCount,
    onPageChange,
    hasNext,
    hasPrev,
}: ResourcePaginationProps) {
    if (totalPages <= 1) return null;

    const startIdx = (currentPage - 1) * 10 + 1;
    const endIdx = startIdx + currentCount - 1;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-8">
            <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{startIdx}</span> to{" "}
                <span className="font-medium text-foreground">{endIdx}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span> resources
            </p>

            <Pagination className="w-auto mx-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                if (hasPrev) onPageChange(currentPage - 1);
                            }}
                            className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                if (hasNext) onPageChange(currentPage + 1);
                            }}
                            className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
