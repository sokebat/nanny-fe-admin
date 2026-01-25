import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Course Details",
    description: "View and manage detailed information for a specific educational course.",
};

export default function CourseDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
