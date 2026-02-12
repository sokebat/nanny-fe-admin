import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description: "Invite and manage internal admin and moderator team members.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
