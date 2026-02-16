import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminTeamService } from "@/services/admin-team.service";
import type {
  InviteTeamMemberDto,
  ResendInviteDto,
  DeactivateTeamMemberDto,
  ReactivateTeamMemberDto,
} from "@/types/admin-team";
import { toast } from "react-hot-toast";

export function useAdminTeam() {
  const queryClient = useQueryClient();

  const useTeamMembers = (page: number = 1, limit: number = 10) =>
    useQuery({
      queryKey: ["admin-team", page, limit],
      queryFn: () => adminTeamService.getMembers(page, limit),
    });

  const invite = useMutation({
    mutationFn: (data: InviteTeamMemberDto) => adminTeamService.invite(data),
    onSuccess: () => {
      toast.success("Invite sent successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to send invite");
    },
  });

  const resendInvite = useMutation({
    mutationFn: (data: ResendInviteDto) => adminTeamService.resendInvite(data),
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
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to deactivate");
    },
  });

  const reactivate = useMutation({
    mutationFn: (data: ReactivateTeamMemberDto) =>
      adminTeamService.reactivate(data),
    onSuccess: () => {
      toast.success("Team member reactivated");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to reactivate");
    },
  });

  const deleteMember = useMutation({
    mutationFn: (userId: string) => adminTeamService.deleteMember(userId),
    onSuccess: () => {
      toast.success("Team member deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to delete");
    },
  });

  return {
    useTeamMembers,
    invite,
    resendInvite,
    deactivate,
    reactivate,
    deleteMember,
  };
}
