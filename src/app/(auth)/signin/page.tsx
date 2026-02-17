"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { protectedRoutes, publicRoutes } from "@/data/routes";
import { cn } from "@/lib/utils";
import { signInSchema, type SignInFormData } from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    console.log("Form submitted:", data);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.ok) {
      toast.success("Login successful");
      router.push(protectedRoutes.dashboard);
      router.refresh();
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl  overflow-hidden border border-border">
        {/* Header Section - Navy Background */}
        <div className="bg-brand-navy p-8 text-center relative overflow-hidden">

          <div className="relative inline-flex items-center justify-center p-3 mb-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">

            <div className="bg-brand-orange rounded-lg p-2.5 shadow-inner">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign in</h2>
          <p className="text-white/70 text-sm font-medium">
            Welcome back to Nanny Plug Admin
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 sm:p-10 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-orange" />
                Email Address
              </Label>
              <div
                className={cn(
                  "relative group transition-all duration-200 rounded-xl",
                  errors.email
                    ? "ring-2 ring-destructive/20"
                    : "focus-within:ring-2 focus-within:ring-brand-navy/10"
                )}
              >
                <Input
                  id="email"
                  type="email"
                  className={cn(
                    "h-12 bg-muted/30 border-2 rounded-xl px-4 transition-all duration-200 focus-visible:ring-0",
                    errors.email
                      ? "border-destructive/30 focus:border-destructive"
                      : "border-transparent focus:border-brand-navy/20 active:border-brand-navy/30"
                  )}
                  placeholder="name@company.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-orange" />
                  Password
                </Label>
      
              </div>
              <div
                className={cn(
                  "relative group transition-all duration-200 rounded-xl",
                  errors.password
                    ? "ring-2 ring-destructive/20"
                    : "focus-within:ring-2 focus-within:ring-brand-navy/10"
                )}
              >
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "h-12 bg-muted/30 border-2 rounded-xl px-4 pr-12 transition-all duration-200 focus-visible:ring-0",
                    errors.password
                      ? "border-destructive/30 focus:border-destructive"
                      : "border-transparent focus:border-brand-navy/20 active:border-brand-navy/30"
                  )}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-navy transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs font-medium flex items-center gap-1 mt-1">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-bold bg-brand-navy text-white rounded-xl hover:bg-brand-navy/95 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-brand-navy/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Internal team?{" "}
              <Link
                href="/admin/login"
                className="font-semibold text-brand-navy hover:text-brand-orange transition-colors"
              >
                Sign in to Admin Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
