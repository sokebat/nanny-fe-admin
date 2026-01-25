import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Courses",
    description: "Create, edit, and organize educational courses. Sync with Teachable and manage student offerings.",
};

export default function CoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
