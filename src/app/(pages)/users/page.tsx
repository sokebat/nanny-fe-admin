"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useAdminUsers,
    useBanAdminUser,
    useResolveRestrictionAppeal,
    useRestrictAdminUser,
    useRestrictionAppeals,
    useUnbanAdminUser,
    useUnrestrictAdminUser,
} from "@/hooks/use-admin-users";
import { UsersTable } from "@/components/users/users-table";
import { getUserColumns } from "@/components/users/columns";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdminUser, AdminUserFilters } from "@/types/admin-users";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { RestrictionAppeal, RestrictionAppealStatus, RestrictionAppealsFilters } from "@/types/admin-users";

type NonSearchFilters = Omit<AdminUserFilters, "page" | "limit" | "search">;

const DEFAULT_FILTERS: NonSearchFilters = {
    role: "",
    accountStatus: "",
    fromDate: "",
    toDate: "",
    isActive: "",
    emailVerified: "",
    sortBy: "createdAt",
    sortOrder: "desc",
};

const getAppealUserText = (appeal: RestrictionAppeal): string => {
    const appealUser = appeal.user || (typeof appeal.userId === "string" ? null : appeal.userId);
    if (!appealUser) return typeof appeal.userId === "string" ? appeal.userId : appeal.userId._id;

    const first = appealUser.firstName?.trim() || "";
    const last = appealUser.lastName?.trim() || "";
    const fullName = `${first} ${last}`.trim();
    return fullName || appealUser.email || appealUser._id;
};

export default function UsersPage() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [isAppealDialogOpen, setIsAppealDialogOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
    const [appealsPage, setAppealsPage] = useState(1);
    const [appealStatusFilter, setAppealStatusFilter] = useState<RestrictionAppealStatus | "all">("pending");
    const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
    const [resolveStatus, setResolveStatus] = useState<"approved" | "rejected">("approved");
    const [adminNote, setAdminNote] = useState("");

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
    const resolveAppealMutation = useResolveRestrictionAppeal();
    const restrictUserMutation = useRestrictAdminUser();
    const unrestrictUserMutation = useUnrestrictAdminUser();
    const banUserMutation = useBanAdminUser();
    const unbanUserMutation = useUnbanAdminUser();
    const isModerationBusy =
        restrictUserMutation.isPending ||
        unrestrictUserMutation.isPending ||
        banUserMutation.isPending ||
        unbanUserMutation.isPending;

    const appealsFilters = useMemo<RestrictionAppealsFilters>(
        () => ({
            page: appealsPage,
            limit: 10,
            status: appealStatusFilter === "all" ? "" : appealStatusFilter,
            role: appliedFilters.role || "",
            fromDate: appliedFilters.fromDate || "",
            toDate: appliedFilters.toDate || "",
        }),
        [appealsPage, appealStatusFilter, appliedFilters.role, appliedFilters.fromDate, appliedFilters.toDate]
    );

    const { data: appealsData, isLoading: isAppealsLoading, isFetching: isAppealsFetching } =
        useRestrictionAppeals(appealsFilters);

    const pageCount = data?.pagination?.totalPages || 0;
    const appeals = useMemo(
        () => ((appealsData as any)?.appeals || (appealsData as any)?.docs || []) as RestrictionAppeal[],
        [appealsData]
    );
    const appealsTotalPages =
        (appealsData as any)?.pagination?.totalPages || (appealsData as any)?.totalPages || 1;
    const applyDialogFilters = () => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setAppealsPage(1);
        setAppliedFilters({ ...draftFilters });
        setIsFilterDialogOpen(false);
    };

    const clearAll = () => {
        setSearchInput("");
        setAppliedSearch("");
        setDraftFilters(DEFAULT_FILTERS);
        setIsFilterDialogOpen(false);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        setAppealsPage(1);
        setAppliedFilters(DEFAULT_FILTERS);
    };

    const openFilters = () => {
        setDraftFilters(appliedFilters);
        setIsFilterDialogOpen(true);
    };

    const openResolveAppealDialog = (appealId: string, status: "approved" | "rejected") => {
        setSelectedAppealId(appealId);
        setResolveStatus(status);
        setAdminNote("");
        setIsAppealDialogOpen(true);
    };

    const handleResolveAppeal = async () => {
        if (!selectedAppealId) return;

        try {
            await resolveAppealMutation.mutateAsync({
                appealId: selectedAppealId,
                data: {
                    status: resolveStatus,
                    adminNote: adminNote.trim() || undefined,
                },
            });
            setIsAppealDialogOpen(false);
            setSelectedAppealId(null);
        } catch {
            // error toast is handled by hook
        }
    };

    const handleQuickRestrict = useCallback(async (user: AdminUser) => {
        const reason = window.prompt(`Enter restriction reason for ${user.email}`);
        if (!reason || !reason.trim()) return;
        await restrictUserMutation.mutateAsync({
            id: user._id,
            data: { reason: reason.trim() },
        });
    }, [restrictUserMutation]);

    const handleQuickUnrestrict = useCallback(async (user: AdminUser) => {
        const confirmed = window.confirm(`Unrestrict ${user.email}?`);
        if (!confirmed) return;
        await unrestrictUserMutation.mutateAsync(user._id);
    }, [unrestrictUserMutation]);

    const handleQuickBan = useCallback(async (user: AdminUser) => {
        const reason = window.prompt(`Enter ban reason for ${user.email}`);
        if (!reason || !reason.trim()) return;
        const banEmail = window.confirm("Also ban email reuse?");
        const banPhone = window.confirm("Also ban phone reuse?");

        await banUserMutation.mutateAsync({
            id: user._id,
            data: {
                reason: reason.trim(),
                banEmail,
                banPhone,
            },
        });
    }, [banUserMutation]);

    const handleQuickUnban = useCallback(async (user: AdminUser) => {
        const confirmed = window.confirm(`Unban ${user.email}?`);
        if (!confirmed) return;
        await unbanUserMutation.mutateAsync(user._id);
    }, [unbanUserMutation]);

    const userColumns = useMemo(
        () =>
            getUserColumns({
                isBusy: isModerationBusy,
                onRestrict: (user) => {
                    void handleQuickRestrict(user);
                },
                onUnrestrict: (user) => {
                    void handleQuickUnrestrict(user);
                },
                onBan: (user) => {
                    void handleQuickBan(user);
                },
                onUnban: (user) => {
                    void handleQuickUnban(user);
                },
            }),
        [handleQuickBan, handleQuickRestrict, handleQuickUnban, handleQuickUnrestrict, isModerationBusy]
    );

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
                    {appliedFilters.accountStatus ? <Badge variant="secondary">Account: {appliedFilters.accountStatus}</Badge> : null}
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
                                    <SelectItem value="guest">Guest</SelectItem>
                                    <SelectItem value="nanny">Nanny</SelectItem>
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="account-status-filter">Account Status</Label>
                            <Select
                                value={draftFilters.accountStatus || "all"}
                                onValueChange={(value) =>
                                    setDraftFilters((prev) => ({
                                        ...prev,
                                        accountStatus: value === "all" ? "" : (value as NonNullable<AdminUserFilters["accountStatus"]>),
                                    }))
                                }
                            >
                                <SelectTrigger id="account-status-filter" className="w-full">
                                    <SelectValue placeholder="Select account status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Account Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="restricted">Restricted</SelectItem>
                                    <SelectItem value="banned">Banned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="status-filter">Active Flag</Label>
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
                    columns={userColumns}
                    data={data?.users || []}
                    pageCount={pageCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                />
            )}

            <section className="mt-6 rounded-xl border bg-card p-4 md:p-5 shadow-xs">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight">Restriction Appeals</h3>
                        <p className="text-sm text-muted-foreground">Review and resolve user restriction appeals.</p>
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={appealStatusFilter}
                            onValueChange={(value) => {
                                setAppealsPage(1);
                                setAppealStatusFilter(value as RestrictionAppealStatus | "all");
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isAppealsLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                ) : appeals.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                        No appeals found for the selected filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium">User</th>
                                    <th className="px-3 py-2 text-left font-medium">Role</th>
                                    <th className="px-3 py-2 text-left font-medium">Status</th>
                                    <th className="px-3 py-2 text-left font-medium">Reason</th>
                                    <th className="px-3 py-2 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appeals.map((appeal) => {
                                    const appealUser = appeal.user || (typeof appeal.userId === "string" ? null : appeal.userId);
                                    const role =
                                        !appealUser
                                            ? "N/A"
                                            : appealUser.role || "N/A";
                                    const reasonText = appeal.description || appeal.appealReason || appeal.reason || "No reason provided";
                                    const userLabel = getAppealUserText(appeal);
                                    const userEmail = appealUser?.email;

                                    return (
                                        <tr key={appeal._id} className="border-t">
                                            <td className="px-3 py-2">
                                                <div className="min-w-[220px]">
                                                    <p className="font-medium">{userLabel}</p>
                                                    {userEmail ? (
                                                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 capitalize">{role}</td>
                                            <td className="px-3 py-2 capitalize">{appeal.status}</td>
                                            <td className="px-3 py-2 max-w-xs truncate" title={reasonText}>
                                                {reasonText}
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={appeal.status !== "pending" || resolveAppealMutation.isPending}
                                                        onClick={() => openResolveAppealDialog(appeal._id, "approved")}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={appeal.status !== "pending" || resolveAppealMutation.isPending}
                                                        onClick={() => openResolveAppealDialog(appeal._id, "rejected")}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={appealsPage <= 1 || isAppealsFetching}
                        onClick={() => setAppealsPage((prev) => Math.max(1, prev - 1))}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {appealsPage} of {appealsTotalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={appealsPage >= appealsTotalPages || isAppealsFetching}
                        onClick={() => setAppealsPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            </section>

            <Dialog open={isAppealDialogOpen} onOpenChange={setIsAppealDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{resolveStatus === "approved" ? "Approve Appeal" : "Reject Appeal"}</DialogTitle>
                        <DialogDescription>
                            Resolution will be sent using the selected status and optional admin note.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="appeal-admin-note">Admin Note (optional)</Label>
                        <Textarea
                            id="appeal-admin-note"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Optional admin note..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAppealDialogOpen(false)} disabled={resolveAppealMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            variant={resolveStatus === "approved" ? "default" : "destructive"}
                            onClick={handleResolveAppeal}
                            disabled={resolveAppealMutation.isPending}
                        >
                            {resolveAppealMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Confirm {resolveStatus === "approved" ? "Approval" : "Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
