import { ApiService } from "./api.services";
import type {
  InviteTeamMemberDto,
  ResendInviteDto,
  DeactivateTeamMemberDto,
} from "@/types/admin-team";
import type { ApiResponse } from "@/types/subscription";

/**
 * Admin internal team management (Bearer token required).
 * - Invite team member
 * - Resend invite
 * - Deactivate team member
 */
class AdminTeamService extends ApiService {
  /** POST /admin/team/invite */
  async invite(data: InviteTeamMemberDto): Promise<{ message?: string }> {
    const res = await this.post<ApiResponse<{ message?: string }>>(
      "/admin/team/invite",
      data,
      true
    );
    const apiRes = res as ApiResponse<{ message?: string }>;
    return apiRes?.data ?? {};
  }

  /** POST /admin/team/resend-invite */
  async resendInvite(data: ResendInviteDto): Promise<{ message?: string }> {
    const res = await this.post<ApiResponse<{ message?: string }>>(
      "/admin/team/resend-invite",
      data,
      true
    );
    const apiRes = res as ApiResponse<{ message?: string }>;
    return apiRes?.data ?? {};
  }

  /** POST /admin/team/deactivate */
  async deactivate(data: DeactivateTeamMemberDto): Promise<void> {
    const res = await this.post<ApiResponse<void>>(
      "/admin/team/deactivate",
      data,
      true
    );
    if (res && typeof (res as ApiResponse<void>).data !== "undefined") {
      return (res as ApiResponse<void>).data as void;
    }
    return undefined as void;
  }
}

export const adminTeamService = new AdminTeamService();
