import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Loader2 } from "lucide-react";

export interface CourseItem {
    id: number;
    name: string;
    detail: string;
    price: string;
    _id?: string;
    isPopular?: boolean;
    isListed?: boolean;
}

interface CoursesTableProps {
    courses: CourseItem[];
    onView?: (courseId: string) => void;
    onDelete?: (courseId: string) => void;
    isDeleting?: boolean;
    /** When set, only the delete button for this course shows a loading spinner. */
    deletingCourseId?: string | null;
}

export function CoursesTable({
    courses,
    onView,
    onDelete,
    isDeleting = false,
    deletingCourseId = null,
}: CoursesTableProps) {
    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No courses found</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => {
                        return (
                            <TableRow key={course.id || course._id}>
                                <TableCell className="font-medium text-foreground">
                                    <a
                                        href={`/courses/${course._id}`}
                                        className="flex items-center gap-2 hover:text-primary transition-colors"
                                    >
                                        {course.name}
                                    </a>
                                </TableCell>
                                <TableCell className="text-muted-foreground max-w-md truncate">
                                    {course.detail}
                                </TableCell>
                                <TableCell className="text-foreground font-semibold">
                                    {course.price}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">

                                        {onView && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="View Course"
                                                onClick={() => onView(course._id!)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {onDelete && course._id && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Delete Course"
                                                onClick={() => onDelete(course._id!)}
                                                disabled={isDeleting}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                {(isDeleting && deletingCourseId === course._id) ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
