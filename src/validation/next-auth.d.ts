// next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires: string;
    user: {
      id: string;
      email: string;
      name?: string | null;
      firstName?: string;
      lastName?: string;
      role?: string;
      emailVerified?: boolean;
      phoneVerified?: boolean;
      image?: string | null;
      googleId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    firstName?: string;
    lastName?: string;
    role?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    googleId?: string;
    email?: string;
    id?: string;
    name?: string | null;
    firstName?: string;
    lastName?: string;
    role?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    googleAccessToken?: string;
    googleIdToken?: string;
    googleTokenExpires?: number;
  }
}
