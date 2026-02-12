import { ApiService } from "./api.services";
import type {
  CompleteInviteDto,
  SendLoginOtpDto,
  VerifyLoginOtpDto,
  AdminAuthTokens,
} from "@/types/admin-team";
import type { ApiResponse } from "@/types/subscription";

/**
 * Admin internal auth flows (no Bearer token).
 * - Complete invite (set password after invite email)
 * - Send login OTP (step 1)
 * - Verify login OTP (step 2, returns tokens)
 */
class AdminAuthService extends ApiService {
  /** POST /auth/admin/complete-invite */
  async completeInvite(data: CompleteInviteDto): Promise<void> {
    const res = await this.post<ApiResponse<void>>(
      "/auth/admin/complete-invite",
      data,
      false
    );
    if (res && typeof (res as ApiResponse<void>).data !== "undefined") {
      return (res as ApiResponse<void>).data as void;
    }
    return undefined as void;
  }

  /** POST /auth/admin/send-login-otp */
  async sendLoginOtp(data: SendLoginOtpDto): Promise<void> {
    const res = await this.post<ApiResponse<void>>(
      "/auth/admin/send-login-otp",
      data,
      false
    );
    if (res && typeof (res as ApiResponse<void>).data !== "undefined") {
      return (res as ApiResponse<void>).data as void;
    }
    return undefined as void;
  }

  /** POST /auth/admin/verify-login-otp - returns accessToken, refreshToken, user */
  async verifyLoginOtp(data: VerifyLoginOtpDto): Promise<AdminAuthTokens> {
    const response = await this.post<ApiResponse<AdminAuthTokens>>(
      "/auth/admin/verify-login-otp",
      data,
      false
    );
    const apiRes = response as ApiResponse<AdminAuthTokens>;
    if (apiRes?.data != null) return apiRes.data;
    throw new Error(apiRes?.message ?? "Failed to verify OTP");
  }
}

export const adminAuthService = new AdminAuthService();
