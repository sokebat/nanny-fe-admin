# Admin Internal Team Management (Frontend)

This document describes how the **Nanny Plug Admin** frontend implements internal team management and admin auth flows. It aligns with the backend spec in `ADMIN_INTERNAL_TEAM_MANAGEMENT.md`.

---

## Overview

- **Public user flows** (parents, nannies, vendors) are unchanged.
- **Internal team** (admins and moderators) use:
  1. **Invite** → onboarding (set password via secure token link).
  2. **Login** → password + email OTP (2-step) for admin dashboard access.

---

## Frontend Routes & Backend Alignment

| Backend / Doc | Frontend route | Purpose |
|---------------|----------------|--------|
| Invite email link: `${FRONTEND_URL}/admin/onboarding?token=...` | `/admin/onboarding` | Redirects to `/complete-invite?token=...` so backend link works as-is. |
| Onboarding (set password) | `/complete-invite?token=...` | Form: first name, last name, password, confirm password. Calls `POST /auth/admin/complete-invite`. |
| Team management UI | `/team` (protected) | Invite, resend invite, deactivate. Uses `POST /admin/team/*` with Bearer token. |
| Admin 2-step login | (Optional) custom admin sign-in | Step 1: `POST /auth/admin/send-login-otp`. Step 2: `POST /auth/admin/verify-login-otp` → store tokens. |

---

## 1. Admin Team Management (Protected, Admin-only)

**Page:** `/team` (sidebar: **Team**)

All requests use the logged-in admin’s JWT (`Authorization: Bearer <accessToken>`).

### 1.1 Invite team member

- **UI:** Card “Invite team member” — email, role (admin / moderator), first name, last name.
- **API:** `POST /admin/team/invite`
- **Body:** `{ email, role, firstName, lastName }`
- **Service:** `adminTeamService.invite(data)`
- **Hook:** `useAdminTeam().invite`

Backend creates an internal user and sends an invite email with link to **`/admin/onboarding?token=<inviteToken>`**.

### 1.2 Resend invite

- **UI:** Card “Resend invite” — email input.
- **API:** `POST /admin/team/resend-invite`
- **Body:** `{ email }`
- **Service:** `adminTeamService.resendInvite(data)`
- **Hook:** `useAdminTeam().resendInvite`

### 1.3 Deactivate team member

- **UI:** Card “Deactivate team member” — user ID input.
- **API:** `POST /admin/team/deactivate`
- **Body:** `{ userId }`
- **Service:** `adminTeamService.deactivate(data)`
- **Hook:** `useAdminTeam().deactivate`

---

## 2. Admin Invite Completion (Onboarding)

**Backend:** `POST /auth/admin/complete-invite`  
**Frontend:** `/complete-invite?token=...` (also reachable via `/admin/onboarding?token=...`).

### Flow

1. User clicks link from invite email:  
   `https://<FRONTEND_URL>/admin/onboarding?token=<inviteToken>`
2. Frontend redirects to `/complete-invite?token=<inviteToken>`.
3. User sees “Complete your account”: first name, last name, password, confirm password.
4. On submit, frontend calls `POST /auth/admin/complete-invite` with:
   - `token` (from URL)
   - `password`, `confirmPassword`, `firstName`, `lastName`
5. On success, user is redirected to `/signin` to log in.

### Query param

- Backend sends **`token`** in the invite link. Frontend reads **`token`** (and optionally **`upn`** for compatibility).

### Implementation

- **Types:** `CompleteInviteDto` in `src/types/admin-team.ts`
- **Service:** `adminAuthService.completeInvite(data)` in `src/services/admin-auth.service.ts`
- **Hook:** `useAdminAuth().completeInvite` in `src/hooks/use-admin-auth.ts`
- **Page:** `src/app/(auth)/complete-invite/page.tsx`

---

## 3. Admin 2-step login (Email OTP)

Used so internal admins/moderators sign in with **password + email OTP** instead of the standard login.

### Step 1: Send OTP

- **API:** `POST /auth/admin/send-login-otp`
- **Body:** `{ email, password }`
- **Service:** `adminAuthService.sendLoginOtp(data)`
- **Hook:** `useAdminAuth().sendLoginOtp`

Backend validates credentials, ensures user is internal and active, then sends a 6-digit OTP to the admin email. No tokens returned.

### Step 2: Verify OTP and get tokens

- **API:** `POST /auth/admin/verify-login-otp`
- **Body:** `{ email, code }` (e.g. `"123456"`)
- **Response:** `{ data: { user, accessToken, refreshToken } }`
- **Service:** `adminAuthService.verifyLoginOtp(data)`
- **Hook:** `useAdminAuth().verifyLoginOtp`

Frontend must store `accessToken` (and optionally `refreshToken`) and use them for subsequent API calls (e.g. via NextAuth or custom session).

### Implementation

- **Types:** `SendLoginOtpDto`, `VerifyLoginOtpDto`, `AdminAuthTokens` in `src/types/admin-team.ts`
- **Service:** `src/services/admin-auth.service.ts`
- **Hook:** `src/hooks/use-admin-auth.ts`

A dedicated admin sign-in page can call `sendLoginOtp` → show OTP input → `verifyLoginOtp` → then sign in (e.g. custom NextAuth flow or token storage).

---

## 4. File reference

| Layer | Path |
|-------|------|
| Types | `src/types/admin-team.ts` |
| Auth service (complete-invite, send-otp, verify-otp) | `src/services/admin-auth.service.ts` |
| Team service (invite, resend, deactivate) | `src/services/admin-team.service.ts` |
| Auth hook | `src/hooks/use-admin-auth.ts` |
| Team hook | `src/hooks/use-admin-team.ts` |
| Onboarding redirect (backend link) | `src/app/(auth)/admin/onboarding/page.tsx` |
| Complete invite form | `src/app/(auth)/complete-invite/page.tsx` |
| Team management page | `src/app/(pages)/team/page.tsx` |

---

## 5. Postman / API base URL

- Backend base URL is set via `NEXT_PUBLIC_API_BASE_URL` (used by `src/services/axios.ts`).
- Admin collection: `admin-api.postman.json` (or backend’s `NannyPlug_API_Admin_Internal_Team.postman_collection.json`).
- Set `base_url` to the same API root (e.g. `http://localhost:3000/api`) when testing.

---

## 6. Backend behaviour (summary)

- **User model:** Internal users have `isInternal`, `twoFactorRequired`, `inviteToken`, `inviteTokenExpiresAt`, `invitedBy`.
- **Invite email:** Uses `MAIL_FROM_HELLO`, link to `/admin/onboarding?token=<inviteToken>`.
- **OTP email:** Uses `MAIL_FROM_SUPPORT`, 6-digit code, expiry (e.g. 10 minutes).
- **Guards:** `/admin/team/*` requires JWT + `role = admin`.

This frontend doc should be read together with the backend’s **ADMIN_INTERNAL_TEAM_MANAGEMENT.md** for full behaviour and validation rules.
