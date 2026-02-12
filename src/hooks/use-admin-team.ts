import { useMutation } from "@tanstack/react-query";
import { adminTeamService } from "@/services/admin-team.service";
import type {
  InviteTeamMemberDto,
  ResendInviteDto,
  DeactivateTeamMemberDto,
} from "@/types/admin-team";
import { toast } from "react-hot-toast";

export function useAdminTeam() {
  const invite = useMutation({
    mutationFn: (data: InviteTeamMemberDto) =>
      adminTeamService.invite(data),
    onSuccess: () => {
      toast.success("Invite sent successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to send invite");
    },
  });

  const resendInvite = useMutation({
    mutationFn: (data: ResendInviteDto) =>
      adminTeamService.resendInvite(data),
    onSuccess: () => {
      toast.success("Invite resent");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to resend invite");
    },
  });

  const deactivate = useMutation({
    mutationFn: (data: DeactivateTeamMemberDto) =>
      adminTeamService.deactivate(data),
    onSuccess: () => {
      toast.success("Team member deactivated");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to deactivate");
    },
  });

  return {
    invite,
    resendInvite,
    deactivate,
  };
}
