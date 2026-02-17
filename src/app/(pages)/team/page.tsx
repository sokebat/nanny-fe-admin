"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAdminTeam } from "@/hooks/use-admin-team";
import type { InternalRole, TeamMember } from "@/types/admin-team";
import {
  Loader2,
  UserPlus,
  Mail,
  UserMinus,
  RefreshCcw,
  Trash2,
  Users,
} from "lucide-react";
import { format } from "date-fns";

export default function TeamPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    useTeamMembers,
    invite,
    resendInvite,
    deactivate,
    reactivate,
    deleteMember,
  } = useAdminTeam();

  const { data: teamData, isLoading } = useTeamMembers(page, limit);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InternalRole>("admin");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [deactivateUserId, setDeactivateUserId] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invite.mutateAsync({
        email: inviteEmail,
        role: inviteRole,
        firstName: inviteFirstName,
        lastName: inviteLastName,
      });
      setInviteEmail("");
      setInviteFirstName("");
      setInviteLastName("");
    } catch {
      // toast in hook
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    try {
      await resendInvite.mutateAsync({ email: resendEmail.trim() });
      setResendEmail("");
    } catch {
      // toast in hook
    }
  };

 

  const toggleStatus = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivate.mutateAsync({ userId });
      } else {
        await reactivate.mutateAsync({ userId });
      }
    } catch {
      // toast in hook
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;
    try {
      await deleteMember.mutateAsync(userId);
    } catch {
      // toast in hook
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
      <div className="wrapper mx-auto space-y-8">
        <div>
          <h2 className="text-[#333] text-3xl md:text-4xl font-bold">Team</h2>
          <p className="text-muted-foreground mt-1">
            Invite and manage internal admin and moderator accounts.
          </p>
        </div>

        {/* Team Members List */}
        <Card className="border border-slate-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamData?.members?.map((member: TeamMember) => (
                        <TableRow key={member._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {member.role}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={member.isActive ? "default" : "secondary"}
                              className={
                                member.isActive
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                              }
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {member.createdAt &&
                              format(new Date(member.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleStatus(member._id, member.isActive)
                                }
                                disabled={
                                  deactivate.isPending || reactivate.isPending
                                }
                                className="h-8 w-8 p-0"
                                title={
                                  member.isActive ? "Deactivate" : "Reactivate"
                                }
                              >
                                {member.isActive ? (
                                  <UserMinus className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <RefreshCcw className="h-4 w-4 text-emerald-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(member._id)}
                                disabled={deleteMember.isPending}
                                className="h-8 w-8 p-0"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {teamData?.members?.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No team members found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {teamData && teamData.pagination.totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (page > 1) setPage(page - 1);
                            }}
                          />
                        </PaginationItem>
                        {Array.from({
                          length: teamData.pagination.totalPages,
                        }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={page === i + 1}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(i + 1);
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (page < teamData.pagination.totalPages)
                                setPage(page + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite team member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="new.admin@example.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => setInviteRole(v as InternalRole)}
                  >
                    <SelectTrigger id="invite-role" className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-firstName">First name</Label>
                  <Input
                    id="invite-firstName"
                    value={inviteFirstName}
                    onChange={(e) => setInviteFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-lastName">Last name</Label>
                  <Input
                    id="invite-lastName"
                    value={inviteLastName}
                    onChange={(e) => setInviteLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={invite.isPending}
                className="bg-brand-navy hover:bg-brand-navy/95 rounded-xl"
              >
                {invite.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending invite...
                  </>
                ) : (
                  "Send invite"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Resend invite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResend} className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="resend-email">Email</Label>
                <Input
                  id="resend-email"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="rounded-xl"
                />
              </div>
              <Button
                type="submit"
                disabled={resendInvite.isPending || !resendEmail.trim()}
                variant="outline"
                className="rounded-xl"
              >
                {resendInvite.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Resend invite"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
