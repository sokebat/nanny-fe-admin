import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge, StatusType } from "@/components/shared/status-badge";

export interface CourseItem {
    id: number;
    name: string;
    detail: string;
    location: string;
    price: string;
    status: StatusType;
}

interface CoursesTableProps {
    courses: CourseItem[];
}

export function CoursesTable({ courses }: CoursesTableProps) {
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
                        <TableHead>Courses</TableHead>
                        <TableHead>Detail</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell className="font-medium text-foreground">
                                {course.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {course.detail}
                            </TableCell>
                            <TableCell className="text-foreground">{course.location}</TableCell>
                            <TableCell className="text-foreground">{course.price}</TableCell>
                            <TableCell>
                                <StatusBadge status={course.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
