"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, ShieldCheck, Mail, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
    const router = useRouter();
    const { sendLoginOtp, verifyLoginOtp } = useAdminAuth();

    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            await sendLoginOtp.mutateAsync({ email, password });
            setStep(2);
        } catch {
            // toast handled in hook
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) return;

        setIsSubmitting(true);
        try {
            const data = await verifyLoginOtp.mutateAsync({ email, code: otp });

            // Sign in to NextAuth session using the tokens we got
            const result = await signIn("credentials", {
                email: data.user?.email || email,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                userId: data.user?.id,
                firstName: data.user?.firstName,
                lastName: data.user?.lastName,
                role: data.user?.role,
                isAdminLogin: "true",
                redirect: false,
            });

            if (result?.ok) {
                toast.success("Admin login successful");
                router.push("/");
                router.refresh();
            } else {
                toast.error("Failed to establish session");
            }
        } catch (err: any) {
            // toast handled in hook
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] py-8 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden border border-border shadow-xl">
                {/* Header Section */}
                <div className="bg-brand-navy p-8 text-center relative overflow-hidden">
                    <div className="relative inline-flex items-center justify-center p-3 mb-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                        <div className="bg-brand-orange rounded-lg p-2.5 shadow-inner">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="text-white/70 text-sm font-medium">
                        {step === 1
                            ? "Secure two-step authentication"
                            : "Verify your identity"}
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-8 sm:p-10">
                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-brand-orange" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@thenannyplug.com"
                                    required
                                    className="h-12 rounded-xl border-2 focus-visible:ring-brand-navy/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                    <KeyRound className="w-4 h-4 text-brand-orange" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-12 rounded-xl border-2 focus-visible:ring-brand-navy/10"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={sendLoginOtp.isPending}
                                className="w-full h-12 text-base font-bold bg-brand-navy text-white rounded-xl hover:bg-brand-navy/95 transition-all shadow-lg"
                            >
                                {sendLoginOtp.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Next Step
                            </Button>

                            <div className="text-center pt-2">
                                <Link
                                    href="/signin"
                                    className="text-xs font-semibold text-muted-foreground hover:text-brand-navy transition-colors flex items-center justify-center gap-1"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Standard Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-3 text-center mb-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange/10 mb-2">
                                    <Mail className="w-6 h-6 text-brand-orange" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Verification Code</h3>
                                <p className="text-sm text-muted-foreground px-4">
                                    We've sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    placeholder="000000"
                                    required
                                    className="h-14 text-center text-3xl tracking-[0.5em] font-mono rounded-xl border-2 focus-visible:ring-brand-navy/10"
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || otp.length < 6}
                                className="w-full h-12 text-base font-bold bg-brand-navy text-white rounded-xl hover:bg-brand-navy/95 transition-all shadow-lg"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Verify & Login
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm font-semibold text-muted-foreground hover:text-brand-navy transition-colors"
                                disabled={isSubmitting}
                            >
                                Change email or password
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
