import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invoices",
    description: "View and manage billing history, generate invoices, and track payment statuses.",
};

export default function InvoicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
