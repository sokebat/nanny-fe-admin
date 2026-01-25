import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resource Details",
    description: "View and manage detailed information for a specific digital resource.",
};

export default function ResourceDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
