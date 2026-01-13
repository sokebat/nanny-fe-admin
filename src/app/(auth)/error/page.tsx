"use client";

import { Button } from "@/components/ui/button";
import { publicRoutes } from "@/data/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthSignin":
        return "Error in constructing an authorization URL.";
      case "OAuthCallback":
        return "Error in handling the response from an OAuth provider.";
      case "OAuthCreateAccount":
        return "Could not create OAuth account.";
      case "EmailCreateAccount":
        return "Could not create email account.";
      case "Callback":
        return "Error in the OAuth callback handler route.";
      case "OAuthAccountNotLinked":
        return "Email on the account is already linked, but not with this OAuth account.";
      case "EmailSignin":
        return "Sending the e-mail with the verification token failed.";
      case "CredentialsSignin":
        return "Invalid email or password.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="flex flex-col justify-center w-full items-center">
      <div className="mb-6 text-center max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Authentication Error
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-4">{getErrorMessage(error)}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href={publicRoutes.auth.login}>Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={publicRoutes.auth.login}>Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
