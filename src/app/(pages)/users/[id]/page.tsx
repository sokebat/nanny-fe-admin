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
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            <div className="max-w-7xl mx-auto space-y-8">
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
                <div className="bg-white rounded-[2rem] p-4 md:p-8 border border-border shadow-none flex flex-col md:flex-row gap-5 md:gap-8 items-start md:items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-64 bg-secondary/5 rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />

                    <div className="relative">
                        <div className="size-28 md:size-32 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden border-4 border-white">
                            {(user.avatar || (profile as any)?.profileImageUrl) ? (
                                <img
                                    src={user.avatar || (profile as any)?.profileImageUrl}
                                    alt={user.firstName}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <UserIcon className="size-12" />
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary size-8 rounded-xl border-4 border-white flex items-center justify-center">
                            <ShieldCheck className="size-4 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h2 className="text-2xl md:text-4xl font-black text-brand-navy font-outfit break-words">{user.firstName} {user.lastName}</h2>
                            <Badge className="bg-brand-navy text-white font-bold px-4 py-1 rounded-xl uppercase tracking-widest text-[10px]">
                                {user.role}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground font-medium text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="size-4 text-secondary/70" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="size-4 text-secondary/70" />
                                {user.phone || "No phone linked"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-secondary/70" />
                                Joined {safeDate(user.createdAt, "PPP")}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
                        <StatItem label="Jobs" value={stats.jobsCount} color="bg-secondary/10 text-secondary" />
                        <StatItem label="Apps" value={stats.applicationsCount} color="bg-primary/10 text-primary" />
                        <StatItem label="Subs" value={stats.subscriptionsCount} color="bg-brand-navy/10 text-brand-navy" />
                        <StatItem label="Courses" value={stats.coursesCount} color="bg-emerald-50 text-emerald-600" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Profile */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Details Card */}
                        <Card className="rounded-[2rem] border-border shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-navy">
                                    <div className="p-2 bg-secondary/10 rounded-lg">
                                        <Briefcase className="size-4 text-secondary" />
                                    </div>
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {profile ? (
                                    <>
                                        <div className="space-y-4">
                                            {user.role === 'nanny' && <NannyProfileDetails profile={profile as NannyProfile} />}
                                            {user.role === 'parent' && <ParentProfileDetails profile={profile as ParentProfile} />}
                                            {user.role === 'vendor' && <VendorProfileDetails profile={profile as VendorProfile} />}
                                        </div>

                                        {profile.bio && (
                                            <>
                                                <Separator className="bg-border" />
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">About</span>
                                                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                        "{profile.bio}"
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground italic text-sm">
                                        Profile not completed yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="rounded-[2rem] border-border shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-navy">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <MapPin className="size-4 text-primary" />
                                    </div>
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile?.address ? (
                                    <div className="space-y-1">
                                        <p className="font-bold text-brand-navy">{profile.address.city}, {profile.address.state}</p>
                                        <p className="text-sm text-muted-foreground">{profile.address.zipCode}, {profile.address.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No address provided</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Moderation Card */}
                        <Card className="rounded-[2rem] border-border shadow-none">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-navy">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <ShieldCheck className="size-4 text-amber-700" />
                                    </div>
                                    Moderation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Status</p>
                                        <p className="font-semibold capitalize">{accountStatus}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Restricted Reason</p>
                                        <p className="font-medium">{restrictedReason || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Restricted At</p>
                                        <p className="font-medium">{safeDate(user.restrictedAt, "PPP p")}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Restricted By</p>
                                        <p className="font-medium break-all">{user.restrictedBy || "N/A"}</p>
                                    </div>
                                </div>
                                <Separator className="bg-border" />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Moderation History
                                    </p>
                                    {moderationHistory.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No moderation history.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {moderationHistory.map((entry) => (
                                                <div key={entry._id} className="rounded-xl border p-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Badge variant="outline" className="capitalize">
                                                            {entry.action}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {safeDate(entry.createdAt, "PP p")}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-foreground/80">{entry.reason || "No reason provided"}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground break-all">
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
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2rem] p-4 md:p-8 border border-border shadow-none min-h-[500px]">
                            <Tabs defaultValue="subscriptions" className="space-y-8">
                                <TabsList className="flex gap-2 md:gap-4 bg-transparent h-auto p-0 overflow-x-auto pb-2">
                                    <TabTrigger value="subscriptions" label="Subscribed Plans" />
                                    <TabTrigger value="invoices" label="Billing & Invoices" />
                                    <TabTrigger value="courses" label="Learning Progress" />
                                    <TabTrigger value="jobs" label={user.role === 'nanny' ? 'Applications' : 'Platform Activity'} />
                                </TabsList>

                                <div className="pt-4">
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
        <div className={`${color} p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center min-w-[72px]`}>
            <span className="text-2xl font-black">{value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
        </div>
    );
}

function TabTrigger({ value, label }: { value: string; label: string }) {
    return (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-brand-navy data-[state=active]:text-white rounded-xl px-3 md:px-5 py-2.5 text-xs font-bold transition-all border border-border data-[state=active]:border-brand-navy whitespace-nowrap"
        >
            {label}
        </TabsTrigger>
    );
}

function NannyProfileDetails({ profile }: { profile: NannyProfile }) {
    return (
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
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
        <div className="space-y-4">
            <DetailItem icon={Briefcase} label="Business" value={profile.businessName || "Not set"} />
            <DetailItem icon={Star} label="Type" value={profile.businessType || "N/A"} />
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Icon className="size-3 text-secondary" /> {label}
            </span>
            <p className="text-sm font-bold text-brand-navy truncate">{value}</p>
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

    if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-slate-300" /></div>;

    if (validSubs.length === 0) {
        return <EmptyState message="No active subscriptions found." />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validSubs.map((sub) => {
                const amount = sub.billingCycle === 'yearly' ? sub.planId.pricingYearly : sub.planId.pricingMonthly;

                return (
                    <div key={sub._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-primary/5 border border-primary/10 rounded-2xl cursor-default">
                        <div>
                            <p className="font-bold text-brand-navy uppercase tracking-tight">{sub.planId.name}</p>
                            <p className="text-xs text-muted-foreground font-medium capitalize">{sub.billingCycle ? `${sub.billingCycle} Billing` : 'Billing summary'}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <p className="font-black text-brand-navy text-lg">${amount}</p>
                            <Badge className={`text-[10px] font-bold uppercase ${sub.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
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

    if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-slate-300" /></div>;

    if (invoices.length === 0) {
        return <EmptyState message="No billing history found." />;
    }

    return (
        <div className="space-y-4">
            {invoices.map((invoice) => (
                <div key={invoice._id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 md:p-5 bg-white border border-border rounded-2xl">
                    <div className="flex items-start gap-4">
                        <div className="bg-secondary/5 p-3 rounded-xl border border-secondary/10">
                            <Calendar className="size-5 text-secondary" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-brand-navy">{safeDate(invoice.issuedAt, "PPP")}</span>
                                <Badge variant="outline" className="text-[9px] uppercase font-black border-slate-200 text-slate-400 py-0 h-4">
                                    {invoice.invoiceNumber}
                                </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground line-clamp-1">{invoice.description || "Subscription Payment"}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8">
                        <span className="text-lg font-black text-brand-navy">
                            {invoice.currency === 'USD' ? '$' : invoice.currency}{invoice.total || invoice.amount}
                        </span>
                        <Badge className={`min-w-[80px] justify-center text-[10px] font-bold uppercase transition-transform ${invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
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

    if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-slate-300" /></div>;

    if (courses.length === 0) {
        return <EmptyState message="No learning activity recorded." />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
                <div key={course._id} className="p-6 bg-white border border-border rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-start">
                        <h4 className="font-black text-brand-navy leading-tight">{course.title}</h4>
                        <Badge className={`text-[10px] font-bold uppercase ${course.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-secondary/10 text-secondary'}`}>
                            {course.status}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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

    if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-8 animate-spin text-slate-300" /></div>;

    if (jobs.length === 0) {
        return <EmptyState message="No platform activity recorded." />;
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div key={job._id} className="p-4 md:p-6 bg-white border border-border rounded-[2rem]">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-brand-navy">{job.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{job.description}</p>
                        </div>
                        <Badge className={`whitespace-nowrap min-w-[100px] justify-center text-[10px] font-bold uppercase border-none ${job.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                            job.status === 'in_progress' ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-muted-foreground'
                            }`}>
                            {job.status.replace('_', ' ')}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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
        <div className="flex flex-col items-center justify-center py-20 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/20">
            <div className="bg-white p-4 rounded-full border border-border mb-4">
                <Briefcase className="size-8 text-primary/20" />
            </div>
            <p className="text-brand-navy/60 font-bold italic tracking-tight">{message}</p>
        </div>
    );
}

