import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Resources",
    description: "Curate and manage the digital resource library, including guides, templates, and downloadable content.",
};

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
