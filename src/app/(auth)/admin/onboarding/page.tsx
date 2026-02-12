"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Backend sends invite link: ${FRONTEND_URL}/admin/onboarding?token=${inviteToken}
 * This route redirects to the complete-invite form with the token so one flow handles onboarding.
 */
function OnboardingRedirectInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.replace(`/complete-invite?token=${encodeURIComponent(token)}`);
    } else {
      router.replace("/complete-invite");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-muted-foreground text-sm">Redirecting to complete your account…</p>
    </div>
  );
}

function OnboardingRedirect() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      }
    >
      <OnboardingRedirectInner />
    </Suspense>
  );
}

export default function AdminOnboardingPage() {
  return <OnboardingRedirect />;
}
