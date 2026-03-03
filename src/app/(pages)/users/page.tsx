"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminUsers } from "@/hooks/use-admin-users";
import { UsersTable } from "@/components/users/users-table";
import { columns } from "@/components/users/columns";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdminUserFilters } from "@/types/admin-users";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type NonSearchFilters = Omit<AdminUserFilters, "page" | "limit" | "search">;

const DEFAULT_FILTERS: NonSearchFilters = {
    role: "",
    fromDate: "",
    toDate: "",
    isActive: "",
    emailVerified: "",
    sortBy: "createdAt",
    sortOrder: "desc",
};

export default function UsersPage() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const nextSearch = searchInput.trim();
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            setAppliedSearch(nextSearch);
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    const requestFilters = useMemo(
        () => ({
            ...appliedFilters,
            search: appliedSearch,
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
        }),
        [appliedFilters, appliedSearch, pagination.pageIndex, pagination.pageSize]
    );

    const { data, isLoading, isFetching, isError } = useAdminUsers(requestFilters);

    const pageCount = data?.pagination?.totalPages || 0;
    const totalUsers = data?.pagination?.total || 0;

    const applyDialogFilters = () => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setAppliedFilters({ ...draftFilters });
        setIsFilterDialogOpen(false);
    };

    const clearAll = () => {
        setSearchInput("");
        setAppliedSearch("");
        setDraftFilters(DEFAULT_FILTERS);
        setIsFilterDialogOpen(false);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setAppliedFilters(DEFAULT_FILTERS);
    };

    const openFilters = () => {
        setDraftFilters(appliedFilters);
        setIsFilterDialogOpen(true);
    };

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Manage all users (Nannies, Parents, Vendors)
                    </p>
                </div>
            </div>

            <section className="mb-6 rounded-xl border bg-card p-4 md:p-5 shadow-xs">
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex-1">
                        <Label htmlFor="users-search" className="mb-1.5">
                            Search Users
                        </Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="users-search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by name or email"
                                className="pl-9"
                            />
                        </div>
                
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={openFilters}>
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </Button>
                        <Button variant="ghost" onClick={clearAll} disabled={isFetching}>
                            Clear All
                        </Button>
                      
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {isFetching ? (
                        <Badge variant="secondary" className="gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Updating results...
                        </Badge>
                    ) : null}
                    {appliedSearch ? <Badge variant="secondary">Search: {appliedSearch}</Badge> : null}
                    {appliedFilters.role ? <Badge variant="secondary">Role: {appliedFilters.role}</Badge> : null}
                    {appliedFilters.isActive !== "" ? (
                        <Badge variant="secondary">Status: {appliedFilters.isActive ? "active" : "inactive"}</Badge>
                    ) : null}
                    {appliedFilters.emailVerified !== "" ? (
                        <Badge variant="secondary">
                            Email: {appliedFilters.emailVerified ? "verified" : "unverified"}
                        </Badge>
                    ) : null}
                    {appliedFilters.fromDate ? <Badge variant="secondary">From Date: {appliedFilters.fromDate}</Badge> : null}
                    {appliedFilters.toDate ? <Badge variant="secondary">To Date: {appliedFilters.toDate}</Badge> : null}
                </div>
            </section>

            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Filter Users</DialogTitle>
                        <DialogDescription>
                            Apply filters for role, date range, status, and sort order.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="role-filter">Role</Label>
                            <Select
                                value={draftFilters.role || "all"}
                                onValueChange={(value) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        role: value === "all" ? "" : (value as AdminUserFilters["role"]),
                                    }))
                                }
                            >
                                <SelectTrigger id="role-filter" className="w-full">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="nanny">Nanny</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="status-filter">Account Status</Label>
                            <Select
                                value={String(draftFilters.isActive === "" ? "all" : draftFilters.isActive)}
                                onValueChange={(value) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        isActive: value === "all" ? "" : value === "true",
                                    }))
                                }
                            >
                                <SelectTrigger id="status-filter" className="w-full">
                                    <SelectValue placeholder="Select account status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Status</SelectItem>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="from-date-filter">From Date</Label>
                            <Input
                                id="from-date-filter"
                                type="date"
                                value={draftFilters.fromDate}
                                onChange={(e) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        fromDate: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="to-date-filter">To Date</Label>
                            <Input
                                id="to-date-filter"
                                type="date"
                                value={draftFilters.toDate}
                                onChange={(e) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        toDate: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email-filter">Email Verification</Label>
                            <Select
                                value={String(draftFilters.emailVerified === "" ? "all" : draftFilters.emailVerified)}
                                onValueChange={(value) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        emailVerified: value === "all" ? "" : value === "true",
                                    }))
                                }
                            >
                                <SelectTrigger id="email-filter" className="w-full">
                                    <SelectValue placeholder="Select email status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Email Status</SelectItem>
                                    <SelectItem value="true">Verified</SelectItem>
                                    <SelectItem value="false">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="sort-by-filter">Sort By</Label>
                            <Select
                                value={draftFilters.sortBy || "createdAt"}
                                onValueChange={(value) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        sortBy: value as NonNullable<AdminUserFilters["sortBy"]>,
                                    }))
                                }
                            >
                                <SelectTrigger id="sort-by-filter" className="w-full">
                                    <SelectValue placeholder="Select sort field" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt">Created Date</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="firstName">First Name</SelectItem>
                                    <SelectItem value="lastName">Last Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="sort-order-filter">Sort Order</Label>
                            <Select
                                value={draftFilters.sortOrder || "desc"}
                                onValueChange={(value) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        sortOrder: value as "asc" | "desc",
                                    }))
                                }
                            >
                                <SelectTrigger id="sort-order-filter" className="w-full">
                                    <SelectValue placeholder="Select sort order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest First</SelectItem>
                                    <SelectItem value="asc">Oldest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={clearAll}>
                            Reset
                        </Button>
                        <Button onClick={applyDialogFilters}>
                            Apply Filters
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isError ? (
                <div className="p-4 rounded-md bg-red-50 text-red-600">
                    Failed to load users. Please try again later.
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <UsersTable
                    columns={columns}
                    data={data?.users || []}
                    pageCount={pageCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}
        </main>
    );
}
