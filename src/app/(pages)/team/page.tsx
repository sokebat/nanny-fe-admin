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
import { useAdminTeam } from "@/hooks/use-admin-team";
import type { InternalRole } from "@/types/admin-team";
import { Loader2, UserPlus, Mail, UserMinus } from "lucide-react";

export default function TeamPage() {
  const { invite, resendInvite, deactivate } = useAdminTeam();
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

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deactivateUserId.trim()) return;
    try {
      await deactivate.mutateAsync({ userId: deactivateUserId.trim() });
      setDeactivateUserId("");
    } catch {
      // toast in hook
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-[#333] text-3xl md:text-4xl font-bold">Team</h2>
          <p className="text-muted-foreground mt-1">
            Invite and manage internal admin and moderator accounts.
          </p>
        </div>

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

        <Card className="border border-slate-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="w-5 h-5" />
              Deactivate team member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeactivate} className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px] space-y-2">
                <Label htmlFor="deactivate-userId">User ID</Label>
                <Input
                  id="deactivate-userId"
                  value={deactivateUserId}
                  onChange={(e) => setDeactivateUserId(e.target.value)}
                  placeholder="USER_ID_OF_TEAM_MEMBER"
                  className="rounded-xl font-mono text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={deactivate.isPending || !deactivateUserId.trim()}
                variant="destructive"
                className="rounded-xl"
              >
                {deactivate.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Deactivate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
