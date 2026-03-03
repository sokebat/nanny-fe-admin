"use client";

import { useAdminUser, useAdminUserSubscriptions, useAdminUserInvoices, useAdminUserCourses, useAdminUserJobs } from "@/hooks/use-admin-users";
import { Loader2, ArrowLeft, Mail, Phone, Calendar, MapPin, User as UserIcon, Briefcase, DollarSign, Star, Clock, Globe, ShieldCheck, Baby } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUser, AdminUserSubscription, AdminUserInvoice, AdminUserCourse, UserJob, NannyProfile, ParentProfile, VendorProfile } from "@/types/admin-users";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useBanAdminUser, useRestrictAdminUser, useUnbanAdminUser, useUnrestrictAdminUser } from "@/hooks/use-admin-users";
import { AccountStatus } from "@/types/admin-users";

const safeDate = (dateVal: any, formatStr: string) => {
    try {
        if (!dateVal) return "N/A";
        const date = new Date(dateVal);
        if (isNaN(date.getTime())) return "N/A";
        return format(date, formatStr);
    } catch (e) {
        return "N/A";
    }
};

const getAccountStatus = (user: AdminUser): AccountStatus => {
    if (user.accountStatus) return user.accountStatus;
    return user.isActive ? "active" : "banned";
};

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: userDetails, isLoading: isLoadingUser } = useAdminUser(id);
    const restrictUserMutation = useRestrictAdminUser();
    const unrestrictUserMutation = useUnrestrictAdminUser();
    const banUserMutation = useBanAdminUser();
    const unbanUserMutation = useUnbanAdminUser();
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<"restrict" | "ban" | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<"unrestrict" | "unban" | null>(null);
    const [reason, setReason] = useState("");
    const [banEmail, setBanEmail] = useState(true);
    const [banPhone, setBanPhone] = useState(false);

    if (isLoadingUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
                <div className="bg-white p-8 rounded-2xl border border-border text-center">
                    <p className="text-muted-foreground font-medium mb-4">User not found</p>
                    <Link href="/users" className="inline-flex items-center text-primary font-bold hover:underline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                    </Link>
                </div>
            </div>
        );
    }

    const { user, profile, stats } = userDetails;
    const accountStatus = userDetails.moderation?.accountStatus || getAccountStatus(user);
    const restrictedReason = userDetails.moderation?.restrictedReason || user.restrictedReason;
    const moderationHistory = userDetails.moderation?.history || [];
    const isMutationLoading =
        restrictUserMutation.isPending ||
        unrestrictUserMutation.isPending ||
        banUserMutation.isPending ||
        unbanUserMutation.isPending;

    const openRestrictDialog = () => {
        setReason("");
        setActionType("restrict");
        setActionDialogOpen(true);
    };

    const openBanDialog = () => {
        setReason("");
        setBanEmail(true);
        setBanPhone(false);
        setActionType("ban");
        setActionDialogOpen(true);
    };

    const handleModerationSubmit = async () => {
        if (!actionType || !reason.trim()) return;
        try {
            if (actionType === "restrict") {
                await restrictUserMutation.mutateAsync({
                    id: user._id,
                    data: { reason: reason.trim() },
                });
            } else {
                await banUserMutation.mutateAsync({
                    id: user._id,
                    data: {
                        reason: reason.trim(),
                        banEmail,
                        banPhone,
                    },
                });
            }

            setActionDialogOpen(false);
        } catch {
            // errors are surfaced via mutation onError toast
        }
    };

    const openUnrestrictConfirm = () => {
        setConfirmType("unrestrict");
        setConfirmDialogOpen(true);
    };

    const openUnbanConfirm = () => {
        setConfirmType("unban");
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!confirmType) return;
        try {
            if (confirmType === "unrestrict") {
                await unrestrictUserMutation.mutateAsync(user._id);
            } else {
                await unbanUserMutation.mutateAsync(user._id);
            }
            setConfirmDialogOpen(false);
            setConfirmType(null);
        } catch {
            // errors are surfaced via mutation onError toast
        }
    };

    return (
        <main className="flex-1 overflow-auto bg-muted p-3 md:p-4">
            <div className="mx-auto max-w-7xl space-y-4">
                {/* Header Navigation */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/users" className="group flex items-center text-sm font-bold text-muted-foreground hover:text-brand-navy transition-colors">
                        <div className="mr-2 bg-white p-2 rounded-lg group-hover:bg-slate-100 transition-colors border border-border">
                            <ArrowLeft className="size-4" />
                        </div>
                        Back to User Management
                    </Link>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <Badge className={`px-3 py-1 font-bold uppercase tracking-wider text-[10px] ${
                            accountStatus === "active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : accountStatus === "restricted"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-600 border-red-100"
                        }`}>
                            Account {accountStatus}
                        </Badge>
                        {accountStatus === "active" ? (
                            <>
                                <Button size="sm" variant="outline" onClick={openRestrictDialog} disabled={isMutationLoading}>
                                    Restrict
                                </Button>
                                <Button size="sm" variant="destructive" onClick={openBanDialog} disabled={isMutationLoading}>
                                    Ban
                                </Button>
                            </>
                        ) : null}
                        {accountStatus === "restricted" ? (
                            <>
                                <Button size="sm" variant="outline" onClick={openUnrestrictConfirm} disabled={isMutationLoading}>
                                    Unrestrict
                                </Button>
                                <Button size="sm" variant="destructive" onClick={openBanDialog} disabled={isMutationLoading}>
                                    Ban
                                </Button>
                            </>
                        ) : null}
                        {accountStatus === "banned" ? (
                            <Button size="sm" variant="outline" onClick={openUnbanConfirm} disabled={isMutationLoading}>
                                Unban
                            </Button>
                        ) : null}
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="relative flex flex-col items-start gap-3 overflow-hidden rounded-xl border border-border bg-white p-3 md:flex-row md:items-center md:gap-4 md:p-4">
                    <div className="absolute top-0 right-0 size-64 bg-secondary/5 rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />

                    <div className="relative">
                        <div className="size-20 overflow-hidden rounded-xl border-2 border-white bg-slate-100 text-slate-400 md:size-24">
                            {(user.avatar || (profile as any)?.profileImageUrl) ? (
                                <img
                                    src={user.avatar || (profile as any)?.profileImageUrl}
                                    alt={user.firstName}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center">
                                    <UserIcon className="size-7" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-md border-2 border-white bg-primary">
                            <ShieldCheck className="size-3 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-lg font-bold text-brand-navy md:text-xl">{user.firstName} {user.lastName}</h2>
                            <Badge className="rounded-md bg-brand-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                {user.role}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Mail className="size-3.5 text-secondary/70" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Phone className="size-3.5 text-secondary/70" />
                                {user.phone || "No phone linked"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-secondary/70" />
                                Joined {safeDate(user.createdAt, "PPP")}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid w-full grid-cols-2 gap-2 md:w-auto lg:grid-cols-4">
                        <StatItem label="Jobs" value={stats.jobsCount} color="bg-secondary/10 text-secondary" />
                        <StatItem label="Apps" value={stats.applicationsCount} color="bg-primary/10 text-primary" />
                        <StatItem label="Subs" value={stats.subscriptionsCount} color="bg-brand-navy/10 text-brand-navy" />
                        <StatItem label="Courses" value={stats.coursesCount} color="bg-emerald-50 text-emerald-600" />
                    </div>
                </div>

                <Card className="rounded-xl border-border shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-brand-navy">Account Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                        <InfoField label="User ID" value={user._id} breakAll />
                        <InfoField label="Google ID" value={user.googleId || "N/A"} breakAll />
                        <InfoField label="Teachable ID" value={user.teachableUserId || "N/A"} />
                        <InfoField label="Account Status" value={accountStatus} capitalize />
                        <InfoField label="Email Verified" value={user.emailVerified ? "Yes" : "No"} />
                        <InfoField label="Phone Verified" value={user.phoneVerified ? "Yes" : "No"} />
                        <InfoField label="Active" value={user.isActive ? "Yes" : "No"} />
                        <InfoField label="Internal User" value={user.isInternal ? "Yes" : "No"} />
                        <InfoField label="2FA Required" value={user.twoFactorRequired ? "Yes" : "No"} />
                        <InfoField label="Last Login" value={safeDate(user.lastLogin, "PP p")} />
                        <InfoField label="Updated At" value={safeDate(user.updatedAt, "PP p")} />
                        <InfoField label="Profile Complete" value={profile?.isProfileComplete ? "Yes" : "No"} />
                        <InfoField label="Profile Shared" value={(profile as any)?.shareProfile === true ? "Yes" : "No"} />
                        <InfoField label="Profile Created" value={safeDate((profile as any)?.createdAt, "PP p")} />
                        <InfoField label="Profile Updated" value={safeDate((profile as any)?.updatedAt, "PP p")} />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Left Column: Details & Profile */}
                    <div className="space-y-4 lg:col-span-1">
                        {/* Profile Details Card */}
                        <Card className="rounded-xl border-border shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                    <div className="rounded-md bg-secondary/10 p-1.5">
                                        <Briefcase className="size-3.5 text-secondary" />
                                    </div>
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {profile ? (
                                    <>
                                        <div className="space-y-2">
                                            {user.role === 'nanny' && <NannyProfileDetails profile={profile as NannyProfile} />}
                                            {user.role === 'parent' && <ParentProfileDetails profile={profile as ParentProfile} />}
                                            {user.role === 'vendor' && <VendorProfileDetails profile={profile as VendorProfile} />}
                                        </div>

                                        {profile.bio && (
                                            <>
                                                <Separator className="bg-border" />
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">About</span>
                                                    <p className="text-xs leading-relaxed text-foreground/80">
                                                        "{profile.bio}"
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="py-5 text-center text-xs italic text-muted-foreground">
                                        Profile not completed yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="rounded-xl border-border shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                    <div className="rounded-md bg-primary/10 p-1.5">
                                        <MapPin className="size-3.5 text-primary" />
                                    </div>
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile?.address ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-brand-navy">{profile.address.city}, {profile.address.state}</p>
                                        <p className="text-xs text-muted-foreground">{profile.address.zipCode}, {profile.address.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-xs italic text-muted-foreground">No address provided</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Moderation Card */}
                        <Card className="rounded-xl border-border shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                                    <div className="rounded-md bg-amber-50 p-1.5">
                                        <ShieldCheck className="size-3.5 text-amber-700" />
                                    </div>
                                    Moderation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Status</p>
                                        <p className="font-medium capitalize">{accountStatus}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Restricted Reason</p>
                                        <p className="font-medium text-foreground/90">{restrictedReason || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Restricted At</p>
                                        <p className="font-medium text-foreground/90">{safeDate(user.restrictedAt, "PPP p")}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Restricted By</p>
                                        <p className="font-medium break-all text-foreground/90">{user.restrictedBy || "N/A"}</p>
                                    </div>
                                </div>
                                <Separator className="bg-border" />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Moderation History
                                    </p>
                                    {moderationHistory.length === 0 ? (
                                        <p className="text-xs italic text-muted-foreground">No moderation history.</p>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {moderationHistory.map((entry) => (
                                                <div key={entry._id} className="rounded-md border p-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Badge variant="outline" className="h-5 px-2 text-[10px] capitalize">
                                                            {entry.action}
                                                        </Badge>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {safeDate(entry.createdAt, "PP p")}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-foreground/80">{entry.reason || "No reason provided"}</p>
                                                    <p className="mt-1 text-[11px] text-muted-foreground break-all">
                                                        Admin: {entry.adminId}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Dynamic Tabs */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="min-h-[420px] rounded-xl border border-border bg-white p-3 shadow-none md:p-4">
                            <Tabs defaultValue="subscriptions" className="space-y-4">
                                <TabsList className="flex h-auto gap-1 overflow-x-auto bg-transparent p-0 pb-1">
                                    <TabTrigger value="subscriptions" label="Subscribed Plans" />
                                    <TabTrigger value="invoices" label="Billing & Invoices" />
                                    <TabTrigger value="courses" label="Learning Progress" />
                                    <TabTrigger value="jobs" label={user.role === 'nanny' ? 'Applications' : 'Platform Activity'} />
                                </TabsList>

                                <div className="pt-2">
                                    <TabsContent value="subscriptions" className="m-0 focus-visible:outline-none">
                                        <SubscriptionsTab userId={user._id} />
                                    </TabsContent>
                                    <TabsContent value="invoices" className="m-0 focus-visible:outline-none">
                                        <InvoicesTab userId={user._id} />
                                    </TabsContent>
                                    <TabsContent value="courses" className="m-0 focus-visible:outline-none">
                                        <CoursesTab userId={user._id} />
                                    </TabsContent>
                                    <TabsContent value="jobs" className="m-0 focus-visible:outline-none">
                                        <JobsTab userId={user._id} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionType === "ban" ? "Ban User" : "Restrict User"}</DialogTitle>
                        <DialogDescription>
                            {actionType === "ban"
                                ? "Banning blocks account access and can block identifier reuse."
                                : "Restricted users can log in but cannot message or apply/create jobs."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="moderation-reason">Reason</Label>
                            <Textarea
                                id="moderation-reason"
                                placeholder={actionType === "ban" ? "Fraud or severe abuse..." : "Policy violation details..."}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                        {actionType === "ban" ? (
                            <div className="space-y-2">
                                <Label>Banned Identifiers</Label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={banEmail}
                                        onChange={(e) => setBanEmail(e.target.checked)}
                                    />
                                    Ban email reuse
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={banPhone}
                                        onChange={(e) => setBanPhone(e.target.checked)}
                                    />
                                    Ban phone reuse
                                </label>
                            </div>
                        ) : null}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialogOpen(false)} disabled={isMutationLoading}>
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === "ban" ? "destructive" : "default"}
                            onClick={handleModerationSubmit}
                            disabled={!reason.trim() || isMutationLoading}
                        >
                            {isMutationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {actionType === "ban" ? "Confirm Ban" : "Confirm Restrict"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{confirmType === "unban" ? "Unban User" : "Unrestrict User"}</DialogTitle>
                        <DialogDescription>
                            {confirmType === "unban"
                                ? "This will unban the user and deactivate related banned identifiers."
                                : "This will remove the restriction and restore messaging and job actions."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setConfirmDialogOpen(false);
                                setConfirmType(null);
                            }}
                            disabled={isMutationLoading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmAction} disabled={isMutationLoading}>
                            {isMutationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}

/* Helper Components */

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`${color} min-w-[60px] rounded-md p-2 text-center`}>
            <span className="block text-sm font-bold leading-none">{value}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{label}</span>
        </div>
    );
}

function TabTrigger({ value, label }: { value: string; label: string }) {
    return (
        <TabsTrigger
            value={value}
            className="whitespace-nowrap rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold transition-all data-[state=active]:border-brand-navy data-[state=active]:bg-brand-navy data-[state=active]:text-white"
        >
            {label}
        </TabsTrigger>
    );
}

function NannyProfileDetails({ profile }: { profile: NannyProfile }) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <DetailItem icon={Clock} label="Experience" value={`${profile.experience || 0} Years`} />
            <DetailItem icon={DollarSign} label="Hourly Rate" value={`$${profile.hourlyRate || 0}/hr`} />
            <div className="col-span-2">
                <DetailItem icon={Star} label="Skills" value={profile.skills?.join(", ") || "None listed"} />
            </div>
            <div className="col-span-2">
                <DetailItem icon={Globe} label="Languages" value={profile.languages?.join(", ") || "English"} />
            </div>
        </div>
    );
}

function ParentProfileDetails({ profile }: { profile: ParentProfile }) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <DetailItem icon={Baby} label="Children" value={`${profile.numberOfChildren || 0} Kids`} />
            <DetailItem icon={Clock} label="Schedule" value={profile.preferredSchedule || "Flexible"} />
            <div className="col-span-2">
                <DetailItem icon={Star} label="Ages" value={profile.childrenAges?.map(a => `${a}y`).join(", ") || "Not specified"} />
            </div>
        </div>
    );
}

function VendorProfileDetails({ profile }: { profile: VendorProfile }) {
    return (
        <div className="space-y-2">
            <DetailItem icon={Briefcase} label="Business" value={profile.businessName || "Not set"} />
            <DetailItem icon={Star} label="Type" value={profile.businessType || "N/A"} />
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="space-y-0.5">
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <Icon className="size-3 text-secondary" /> {label}
            </span>
            <p className="text-xs font-semibold text-brand-navy break-words">{value}</p>
        </div>
    );
}

function InfoField({
    label,
    value,
    breakAll = false,
    capitalize = false,
}: {
    label: string;
    value: string;
    breakAll?: boolean;
    capitalize?: boolean;
}) {
    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`text-xs font-medium text-foreground ${breakAll ? "break-all" : ""} ${capitalize ? "capitalize" : ""}`}>
                {value}
            </p>
        </div>
    );
}

/* Tabs Implementations (Updated to match previous styling) */

function SubscriptionsTab({ userId }: { userId: string }) {
    const { data: response, isLoading } = useAdminUserSubscriptions(userId);
    // @ts-ignore - Handle possible API shape differences
    const subscriptions = (Array.isArray(response) ? response : response?.docs || response?.subscriptions || []) as AdminUserSubscription[];

    // Filter out records that are missing essential display data
    const validSubs = subscriptions.filter(sub => sub.planId?.name);

    if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-slate-300" /></div>;

    if (validSubs.length === 0) {
        return <EmptyState message="No active subscriptions found." />;
    }

    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {validSubs.map((sub) => {
                const amount = sub.billingCycle === 'yearly' ? sub.planId.pricingYearly : sub.planId.pricingMonthly;

                return (
                    <div key={sub._id} className="flex cursor-default flex-col gap-2 rounded-md border border-primary/10 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-tight text-brand-navy">{sub.planId.name}</p>
                            <p className="text-[11px] font-medium capitalize text-muted-foreground">{sub.billingCycle ? `${sub.billingCycle} Billing` : 'Billing summary'}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-sm font-bold text-brand-navy">${amount}</p>
                            <Badge className={`text-[10px] font-semibold uppercase ${sub.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                                {sub.status || 'Unknown'}
                            </Badge>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function InvoicesTab({ userId }: { userId: string }) {
    const { data: response, isLoading } = useAdminUserInvoices(userId);
    // @ts-ignore - Handle possible API shape differences
    const allInvoices = (Array.isArray(response) ? response : response?.docs || response?.invoices || []) as AdminUserInvoice[];

    // Only show invoices with actual amounts and issuance dates
    const invoices = allInvoices.filter(inv => (inv.total || inv.amount) > 0 && inv.issuedAt);

    if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-slate-300" /></div>;

    if (invoices.length === 0) {
        return <EmptyState message="No billing history found." />;
    }

    return (
        <div className="space-y-2">
            {invoices.map((invoice) => (
                <div key={invoice._id} className="flex flex-col gap-2 rounded-md border border-border bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-2.5">
                        <div className="rounded-md border border-secondary/10 bg-secondary/5 p-2">
                            <Calendar className="size-4 text-secondary" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-brand-navy">{safeDate(invoice.issuedAt, "PPP")}</span>
                                <Badge variant="outline" className="text-[9px] uppercase font-black border-slate-200 text-slate-400 py-0 h-4">
                                    {invoice.invoiceNumber}
                                </Badge>
                            </div>
                            <span className="line-clamp-1 text-[11px] text-muted-foreground">{invoice.description || "Subscription Payment"}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-5">
                        <span className="text-sm font-bold text-brand-navy">
                            {invoice.currency === 'USD' ? '$' : invoice.currency}{invoice.total || invoice.amount}
                        </span>
                        <Badge className={`min-w-[72px] justify-center text-[10px] font-semibold uppercase transition-transform ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                            invoice.status === 'pending' ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-600'
                            }`}>
                            {invoice.status}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CoursesTab({ userId }: { userId: string }) {
    const { data: response, isLoading } = useAdminUserCourses(userId);
    // @ts-ignore
    const allCourses = (Array.isArray(response) ? response : response?.docs || response?.courses || []) as AdminUserCourse[];

    // Filter courses with actual titles
    const courses = allCourses.filter(c => c.title);

    if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-slate-300" /></div>;

    if (courses.length === 0) {
        return <EmptyState message="No learning activity recorded." />;
    }

    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {courses.map((course) => (
                <div key={course._id} className="space-y-2 rounded-md border border-border bg-white p-3">
                    <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold leading-tight text-brand-navy">{course.title}</h4>
                        <Badge className={`text-[10px] font-semibold uppercase ${course.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-secondary/10 text-secondary'}`}>
                            {course.status}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function JobsTab({ userId }: { userId: string }) {
    const { data: response, isLoading } = useAdminUserJobs(userId);
    // @ts-ignore
    const allJobs = (Array.isArray(response) ? response : response?.docs || response?.jobs || []) as UserJob[];

    // Only show jobs with titles and descriptions
    const jobs = allJobs.filter(j => j.title && j.description);

    if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-slate-300" /></div>;

    if (jobs.length === 0) {
        return <EmptyState message="No platform activity recorded." />;
    }

    return (
        <div className="space-y-2">
            {jobs.map((job) => (
                <div key={job._id} className="rounded-md border border-border bg-white p-3">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-brand-navy">{job.title}</h4>
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{job.description}</p>
                        </div>
                        <Badge className={`min-w-[82px] justify-center whitespace-nowrap border-none text-[10px] font-semibold uppercase ${job.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                            job.status === 'in_progress' ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-muted-foreground'
                            }`}>
                            {job.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="mt-3 flex flex-col gap-1 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <Calendar className="size-3 text-secondary" />
                            Posted {safeDate(job.createdAt, "PP")}
                        </div>
                   
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-primary/20 bg-primary/5 py-12">
            <div className="mb-2 rounded-full border border-border bg-white p-2">
                <Briefcase className="size-5 text-primary/20" />
            </div>
            <p className="text-xs font-medium text-brand-navy/60">{message}</p>
        </div>
    );
}

