import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics",
    description: "Monitor platform performance, track user activity, and visualize revenue trends.",
};

export default function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
