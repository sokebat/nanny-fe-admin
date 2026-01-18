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
      redirect: true, // redirect to the home page
      callbackUrl: "/",
    });
    if (response?.ok) {
      toast.success("Login successful");
      router.push(protectedRoutes.dashboard);
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Sign in</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Stay updated on your professional world
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email <span className="text-destructive">*</span>
          </Label>
          <div
            className={cn(
              "border-2 rounded-md transition-colors focus-within:ring-2",
              errors.email
                ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                : "border-border focus-within:border-primary/50 focus-within:ring-primary/20"
            )}
          >
            <Input
              id="email"
              type="email"
              className="h-10 sm:h-11 shadow-none px-3 sm:px-4 outline-none focus-visible:ring-0 focus:ring-0 focus:outline-none bg-transparent border-0 text-sm sm:text-base"
              placeholder="Enter your email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password <span className="text-destructive">*</span>
          </Label>
          <div
            className={cn(
              "border-2 rounded-md transition-colors focus-within:ring-2 relative",
              errors.password
                ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                : "border-border focus-within:border-primary/50 focus-within:ring-primary/20"
            )}
          >
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className="h-10 sm:h-11 shadow-none px-3 sm:px-4 pr-10 outline-none focus-visible:ring-0 focus:ring-0 focus:outline-none bg-transparent border-0 text-sm sm:text-base"
              placeholder="Enter your password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}


        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium bg-brand-navy text-white hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>





    </div>
  );
}
