"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    CoursesTable,
    CourseForm,
    CourseStats,
    CoursePagination,
    DeleteCourseDialog,
} from "@/components/courses";
import { useCourses } from "@/hooks/use-course";
import type { CreateCourseDto, UpdateCourseDto, Course } from "@/types/course";
import type { CourseItem } from "@/components/courses";
import { RefreshCw, Loader2 } from "lucide-react";

const ManageCourse = () => {
    const router = useRouter();
    const [formOpen, setFormOpen] = useState(false);
    const [editCourse, setEditCourse] = useState<Course | null>(null);
    const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [togglingCourseId, setTogglingCourseId] = useState<string | null>(null);
    const limit = 10;

    // Fetch courses and stats
    const {
        getCoursesQuery,
        getCourseStatsQuery,
        createCourse,
        updateCourse,
        deleteCourse,
        toggleListing,
        togglePopular,
        syncFromTeachable,
    } = useCourses({
        page: currentPage,
        limit,
    });

    // Transform API courses to CourseItem format for table
    const coursesData: CourseItem[] =
        getCoursesQuery.data?.courses
            ? getCoursesQuery.data.courses.map((course, index) => ({
                  id: index + 1,
                  _id: course._id,
                  name: course.title,
                  detail: course.description || "No description",
                  location: course.category || "Uncategorized",
                  price: `$${course.price}`,
                  isPopular: course.isPopular,
                  isListed: course.isListed,
              }))
            : [];

    const originalCourses = getCoursesQuery.data?.courses || [];
    const pagination = getCoursesQuery.data?.pagination;
    const stats = getCourseStatsQuery.data;

    // Handlers
    const handleOpenCreate = () => {
        setEditCourse(null);
        setFormOpen(true);
    };

    const handleEdit = (course: Course) => {
        router.push(`/courses/${course._id}`);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setEditCourse(null);
    };

    const handleFormSubmit = async (data: CreateCourseDto) => {
        try {
            if (editCourse) {
                await updateCourse.mutateAsync({
                    courseId: editCourse._id,
                    data: data as UpdateCourseDto,
                });
            } else {
                await createCourse.mutateAsync(data);
            }
            handleCloseForm();
        } catch (error) {
            // Error is handled by the hook with toast notification
        }
    };

    const handleDelete = async () => {
        if (deleteCourseId) {
            try {
                await deleteCourse.mutateAsync(deleteCourseId);
                setDeleteCourseId(null);
            } catch (error) {
                // Error is handled by the hook
            }
        }
    };

    const handleToggleListing = async (courseId: string, isListed: boolean) => {
        setTogglingCourseId(courseId);
        try {
            await toggleListing.mutateAsync({ courseId, isListed });
        } finally {
            setTogglingCourseId(null);
        }
    };

    const handleTogglePopular = async (courseId: string, isPopular: boolean) => {
        setTogglingCourseId(courseId);
        try {
            await togglePopular.mutateAsync({ courseId, isPopular });
        } finally {
            setTogglingCourseId(null);
        }
    };

    const handleSyncTeachable = async () => {
        await syncFromTeachable.mutateAsync();
    };

    return (
        <main className="flex-1 p-8 overflow-auto bg-muted">
            <div className="mb-8">
                {/* Header with Actions */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-foreground text-4xl font-bold">Manage Courses</h2>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleSyncTeachable}
                            disabled={syncFromTeachable.isPending}
                            className="gap-2"
                        >
                            {syncFromTeachable.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            Sync Teachable
                        </Button>
                        <Button
                            onClick={handleOpenCreate}
                            className="bg-brand-navy hover:bg-[#2d4a6a] text-white px-8 py-2.5 h-auto"
                        >
                            Upload Course
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                {stats && <CourseStats stats={stats} />}

                {/* Courses Table */}
                {getCoursesQuery.isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading courses...</p>
                    </div>
                ) : getCoursesQuery.isError ? (
                    <div className="text-center py-12">
                        <p className="text-destructive">
                            {getCoursesQuery.error instanceof Error
                                ? getCoursesQuery.error.message
                                : "Failed to load courses"}
                        </p>
                    </div>
                ) : (
                    <>
                        <CoursesTable
                            courses={coursesData}
                            onView={(courseId) => {
                                router.push(`/courses/${courseId}`);
                            }}
                            onDelete={setDeleteCourseId}
                            isDeleting={deleteCourse.isPending}
                        />
                        {pagination && (
                            <CoursePagination
                                currentPage={Number(pagination.page)}
                                totalPages={Number(pagination.totalPages)}
                                total={pagination.total}
                                currentCount={coursesData.length}
                                hasPrev={pagination.hasPrev}
                                hasNext={pagination.hasNext}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}

                {/* Course Form */}
                <CourseForm
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    course={editCourse}
                    onSubmit={handleFormSubmit}
                    isSubmitting={createCourse.isPending || updateCourse.isPending}
                />

                {/* Delete Confirmation Dialog */}
                <DeleteCourseDialog
                    open={!!deleteCourseId}
                    onOpenChange={(open) => !open && setDeleteCourseId(null)}
                    onConfirm={handleDelete}
                    isDeleting={deleteCourse.isPending}
                />
            </div>
        </main>
    );
};

export default ManageCourse;
