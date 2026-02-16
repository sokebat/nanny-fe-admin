/**
 * Types for Admin Internal Auth & Team Management (see admin-api.postman.json).
 */

// ---- Auth (no Bearer) ----

export interface CompleteInviteDto {
  token: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface SendLoginOtpDto {
  email: string;
  password: string;
}

export interface VerifyLoginOtpDto {
  email: string;
  code: string;
}

export interface AdminAuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AdminAuthTokens {
  accessToken: string;
  refreshToken: string;
  user?: AdminAuthUser;
}

// ---- Team (Bearer required) ----

export type InternalRole = "admin" | "moderator";

export interface InviteTeamMemberDto {
  email: string;
  role: InternalRole;
  firstName: string;
  lastName: string;
}

export interface TeamMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | InternalRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  isInternal: boolean;
  twoFactorRequired: boolean;
  invitedBy?: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  inviteToken?: string;
  inviteTokenExpiresAt?: string;
  teachableUserId?: string;
}

export interface ResendInviteDto {
  email: string;
}

export interface DeactivateTeamMemberDto {
  userId: string;
}

export interface ReactivateTeamMemberDto {
  userId: string;
}

export interface GetTeamMembersResponse {
  members: TeamMember[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API response wrapper (if your API uses { data, message, status })
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}
