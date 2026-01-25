import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscriptions",
    description: "Manage subscription plans and track user subscription statuses and renewals.",
};

export default function SubscriptionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
