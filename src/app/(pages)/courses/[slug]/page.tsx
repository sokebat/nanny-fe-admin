"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseForm, DeleteCourseDialog } from "@/components/courses";
import { useCourses } from "@/hooks/use-course";
import type { CreateCourseDto, UpdateCourseDto } from "@/types/course";
import { ArrowLeft, Loader2, Calendar, DollarSign, User, Star, Trash2, Users } from "lucide-react";
import { format } from "date-fns";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.slug as string;

    const [formOpen, setFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

    const {
        getCourseByIdQuery,
        updateCourse,
        deleteCourse,
        toggleListing,
        togglePopular,
    } = useCourses();

    // Get course data using the hook's query function
    const courseQuery = courseId ? getCourseByIdQuery(courseId) : null;

    const handleFormSubmit = async (data: CreateCourseDto) => {
        if (!courseId) return;

        try {
            await updateCourse.mutateAsync({
                courseId,
                data: data as UpdateCourseDto,
            });
            setFormOpen(false);
            courseQuery?.refetch();
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleDelete = async () => {
        if (!courseId) return;
        try {
            await deleteCourse.mutateAsync(courseId);
            setDeleteDialogOpen(false);
            router.push("/courses");
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleToggleListing = async () => {
        if (!courseId || !course) return;
        setTogglingStatus("listing");
        try {
            await toggleListing.mutateAsync({
                courseId,
                isListed: !course.isListed,
            });
            // Refetch after successful toggle to get updated data from API
            await courseQuery?.refetch();
        } catch (error) {
            // Error handled by hook with toast
        } finally {
            setTogglingStatus(null);
        }
    };

    const handleTogglePopular = async () => {
        if (!courseId || !course) return;
        setTogglingStatus("popular");
        try {
            await togglePopular.mutateAsync({
                courseId,
                isPopular: !course.isPopular,
            });
            // Refetch after successful toggle to get updated data from API
            await courseQuery?.refetch();
        } catch (error) {
            // Error handled by hook with toast
        } finally {
            setTogglingStatus(null);
        }
    };

    const handleToggleActive = async () => {
        if (!courseId || !course) return;
        setTogglingStatus("active");
        try {
            await updateCourse.mutateAsync({
                courseId,
                data: { isActive: !course.isActive } as UpdateCourseDto,
            });
            // Refetch after successful toggle to get updated data from API
            await courseQuery?.refetch();
        } catch (error) {
            // Error handled by hook with toast
        } finally {
            setTogglingStatus(null);
        }
    };

    const course = courseQuery?.data;

    if (courseQuery?.isLoading) {
        return (
            <main className="flex-1 p-8 overflow-auto bg-muted">
                <div className="wrapper mx-auto flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground">Loading course...</span>
                </div>
            </main>
        );
    }

    if (courseQuery?.isError) {
        return (
            <main className="flex-1 p-8 overflow-auto bg-muted">
                <div className="wrapper mx-auto">
                    <div className="text-center py-20">
                        <p className="text-destructive text-lg mb-4">
                            {courseQuery.error instanceof Error
                                ? courseQuery.error.message
                                : "Failed to load course"}
                        </p>
                        <Button onClick={() => router.push("/courses")} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="flex-1 p-8 overflow-auto bg-muted">
                <div className="wrapper mx-auto">
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg mb-4">Course not found</p>
                        <Button onClick={() => router.push("/courses")} variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    const thumbnailUrl = course.thumbnailUrl || course.thumbnail;
    const createdByUser =
        typeof course.createdBy === "object" ? course.createdBy : null;

    return (
        <main className="flex-1 p-8 overflow-auto bg-muted">
            <div className="wrapper mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/courses")}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </Button>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">
                                {course.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setFormOpen(true)}
                                className="bg-brand-navy hover:bg-[#2d4a6a] text-white"
                            >
                                Edit Course
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                                disabled={deleteCourse.isPending}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Thumbnail Image */}
                        {thumbnailUrl && (
                            <Card>
                                <CardContent className="p-0">
                                    <div className="relative w-full h-80 rounded-lg overflow-hidden bg-muted/20">
                                        <img
                                            src={thumbnailUrl}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        {course.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">
                                        {course.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Video Preview */}
                        {course.videoUrl && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preview Video</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video rounded-lg overflow-hidden bg-muted/20">
                                        <iframe
                                            src={course.videoUrl}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Course preview video"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <DollarSign className="w-4 h-4" />
                                        <span>Price</span>
                                    </div>
                                    <span className="text-2xl font-bold text-foreground">
                                        ${course.price}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="w-4 h-4" />
                                        <span>Enrollments</span>
                                    </div>
                                    <span className="text-lg font-semibold text-foreground">
                                        {course.enrollmentCount}
                                    </span>
                                </div>

                                {course.ratingCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Star className="w-4 h-4" />
                                            <span>Rating</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold text-foreground">
                                                {course.ratingAverage.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                ({course.ratingCount} reviews)
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {course.targetAudience && course.targetAudience.length > 0 && (
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span>Target Audience</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {course.targetAudience.map((audience) => (
                                                <Badge
                                                    key={audience}
                                                    variant="secondary"
                                                    className="text-xs capitalize"
                                                >
                                                    {audience}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created:</span>
                                        <span className="text-foreground">
                                            {format(new Date(course.createdAt), "MMM dd, yyyy")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Updated:</span>
                                        <span className="text-foreground">
                                            {format(new Date(course.updatedAt), "MMM dd, yyyy")}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Listed</span>
                                    <Badge
                                        variant={course.isListed ? "default" : "secondary"}
                                        className={`cursor-pointer ${togglingStatus === "listing" ? "opacity-50" : ""
                                            }`}
                                        onClick={handleToggleListing}
                                        title="Click to toggle listing status"
                                    >
                                        {togglingStatus === "listing" ? (
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin inline" />
                                        ) : null}
                                        {course.isListed ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Popular</span>
                                    <Badge
                                        variant={course.isPopular ? "default" : "secondary"}
                                        className={`cursor-pointer ${togglingStatus === "popular" ? "opacity-50" : ""
                                            }`}
                                        onClick={handleTogglePopular}
                                        title="Click to toggle popular status"
                                    >
                                        {togglingStatus === "popular" ? (
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin inline" />
                                        ) : null}
                                        {course.isPopular ? "Yes" : "No"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Active</span>
                                    <Badge
                                        variant={course.isActive ? "default" : "destructive"}
                                        className={`cursor-pointer ${togglingStatus === "active" ? "opacity-50" : ""
                                            }`}
                                        onClick={handleToggleActive}
                                        title="Click to toggle active status"
                                    >
                                        {togglingStatus === "active" ? (
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin inline" />
                                        ) : null}
                                        {course.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Creator Info */}
                        {createdByUser && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Created By</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">
                                            {createdByUser.firstName} {createdByUser.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {createdByUser.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Teachable Info */}
                        {course.teachableCourseId && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Teachable Integration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground break-all">
                                        Course ID: {course.teachableCourseId}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                <CourseForm
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    course={course}
                    onSubmit={handleFormSubmit}
                    isSubmitting={updateCourse.isPending}
                />

                {/* Delete Confirmation Dialog */}
                <DeleteCourseDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDelete}
                    isDeleting={deleteCourse.isPending}
                />
            </div>
        </main>
    );
}
