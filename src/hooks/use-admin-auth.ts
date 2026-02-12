import { useMutation } from "@tanstack/react-query";
import { adminAuthService } from "@/services/admin-auth.service";
import type {
  CompleteInviteDto,
  SendLoginOtpDto,
  VerifyLoginOtpDto,
} from "@/types/admin-team";
import { toast } from "react-hot-toast";

export function useAdminAuth() {
  const completeInvite = useMutation({
    mutationFn: (data: CompleteInviteDto) =>
      adminAuthService.completeInvite(data),
    onSuccess: () => {
      toast.success("Account activated. You can sign in now.");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to complete invite");
    },
  });

  const sendLoginOtp = useMutation({
    mutationFn: (data: SendLoginOtpDto) =>
      adminAuthService.sendLoginOtp(data),
    onSuccess: () => {
      toast.success("Check your email for the verification code.");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to send OTP");
    },
  });

  const verifyLoginOtp = useMutation({
    mutationFn: (data: VerifyLoginOtpDto) =>
      adminAuthService.verifyLoginOtp(data),
    onError: (error: Error) => {
      toast.error(error.message ?? "Invalid or expired code");
    },
  });

  return {
    completeInvite,
    sendLoginOtp,
    verifyLoginOtp,
  };
}
