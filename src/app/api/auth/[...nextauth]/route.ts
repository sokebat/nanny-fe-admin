import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      emailVerified: boolean;
      phoneVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
        GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),
      ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { type: "text" },
        refreshToken: { type: "text" },
        isAdminLogin: { type: "text" },
        userId: { type: "text" },
        firstName: { type: "text" },
        lastName: { type: "text" },
        role: { type: "text" },
      },
      async authorize(credentials) {
        // If this is an admin login after OTP verification, we already have tokens
        if (credentials?.isAdminLogin === "true" && credentials.accessToken) {
          return {
            id: credentials.userId || "admin",
            email: credentials.email || "",
            name: `${credentials.firstName || ""} ${credentials.lastName || ""}`.trim(),
            firstName: credentials.firstName || "",
            lastName: credentials.lastName || "",
            role: credentials.role || "admin",
            emailVerified: true,
            phoneVerified: true,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
          };
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
            throw new Error("API base URL is not configured");
          }


          const res = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
          console.log(process.env.NEXT_PUBLIC_API_BASE_URL, "api base url from login");

          if (res.data.status !== 200 || !res.data.data) {
            throw new Error(res.data.message || "Authentication failed");
          }

          const loginResponse = res.data.data;

          if (loginResponse.accessToken) {
            return {
              id: loginResponse.user.id,
              email: loginResponse.user.email,
              name: `${loginResponse.user.firstName} ${loginResponse.user.lastName}`,
              firstName: loginResponse.user.firstName,
              lastName: loginResponse.user.lastName,
              role: loginResponse.user.role,
              emailVerified: loginResponse.user.emailVerified,
              phoneVerified: loginResponse.user.phoneVerified,
              accessToken: loginResponse.accessToken,
              refreshToken: loginResponse.refreshToken,
            };
          }

          return null;
        } catch (error: unknown) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          console.error("Login error:", axiosError?.response?.data || axiosError?.message);
          if (axiosError?.response?.data?.message) {
            throw new Error(axiosError.response.data.message);
          }
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!profile) {
            throw new Error("Profile is undefined");
          }

          if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
            throw new Error("API base URL is not configured");
          }

          const res = await axios.post<LoginResponse>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`,
            {
              email: profile.email,
              name: profile.name,
              googleId: user.id,
            }
          );

          if (res.data.status !== 200 || !res.data.data) {
            throw new Error(res.data.message || "Authentication failed");
          }

          const apiToken = res.data.data.accessToken;
          const refreshToken = res.data.data.refreshToken;
          const userData = res.data.data.user;

          user.accessToken = apiToken;
          user.refreshToken = refreshToken;
          user.id = userData.id;
          user.firstName = userData.firstName;
          user.lastName = userData.lastName;
          user.name = `${userData.firstName} ${userData.lastName}`;
          user.email = userData.email;
          user.role = userData.role;
          user.emailVerified = userData.emailVerified;
          user.phoneVerified = userData.phoneVerified;

          return true;
        } catch (error: unknown) {
          const axiosError = error as {
            response?: { status?: number; data?: { message?: string } };
            message?: string;
          };
          console.error(
            "Google sign-in error:",
            axiosError?.response?.status,
            axiosError?.response?.data || axiosError?.message,
            "Full error:",
            error
          );
          if (axiosError?.response?.data?.message) {
            throw new Error(axiosError.response.data.message);
          }
          throw new Error("Google sign-in failed. Please try again.");
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // Initial sign in - set token from user object
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name ?? null;
        if (user.firstName) token.firstName = user.firstName;
        if (user.lastName) token.lastName = user.lastName;
        if (user.role) token.role = user.role;
        token.emailVerified = Boolean(user.emailVerified);
        token.phoneVerified = Boolean(user.phoneVerified);
        if (user.accessToken) token.accessToken = user.accessToken;
        if (user.refreshToken) token.refreshToken = user.refreshToken;
      }

      if (trigger === "update" && token.accessToken) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          console.log(response, "response from me");

          if (response.data?.data) {
            const userData = response.data.data;
            token.role = userData.role;
            token.emailVerified = userData.emailVerified;
            token.phoneVerified = userData.phoneVerified;
          }

          console.log(token, "token from me");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.role = token.role as string;
      session.user.emailVerified = token.emailVerified as boolean;
      session.user.phoneVerified = token.phoneVerified as boolean;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expires = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60, // 6 hours
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
