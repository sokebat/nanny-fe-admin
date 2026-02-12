"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function CompleteInviteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? searchParams.get("upn") ?? "";
  const { completeInvite } = useAdminAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const hasToken = Boolean(token.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || password !== confirmPassword) return;
    try {
      await completeInvite.mutateAsync({
        token,
        password,
        confirmPassword,
        firstName,
        lastName,
      });
      router.push("/signin");
      router.refresh();
    } catch {
      // toast handled in hook
    }
  };

  if (!hasToken) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl border border-border p-8 text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Invalid or missing invite link</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Use the link from your invite email to set your password and activate your account.
          </p>
          <Button asChild variant="outline">
            <Link href="/signin">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="bg-brand-navy p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Complete your account</h1>
          <p className="text-white/80 text-sm">Set your password to activate your admin account.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="rounded-xl"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-destructive text-xs">Passwords do not match</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={
              completeInvite.isPending ||
              !password ||
              password !== confirmPassword ||
              !firstName ||
              !lastName
            }
            className="w-full h-12 rounded-xl bg-brand-navy hover:bg-brand-navy/95"
          >
            {completeInvite.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Activating...
              </>
            ) : (
              "Activate account"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/signin" className="text-brand-navy hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function CompleteInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      }
    >
      <CompleteInviteForm />
    </Suspense>
  );
}
