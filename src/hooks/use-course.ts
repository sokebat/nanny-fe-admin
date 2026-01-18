import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesService } from "@/services/cources.services";
import type {
    CreateCourseDto,
    UpdateCourseDto,
    CourseFilters,
} from "@/types/course";
import { toast } from "react-hot-toast";

export const COURSES_QUERY_KEY = "courses";
export const COURSE_STATS_QUERY_KEY = "course-stats";

/**
 * Hook for managing courses
 */
export const useCourses = (filters: CourseFilters = {}) => {
    const queryClient = useQueryClient();

    // Get all courses query
    const getCoursesQuery = useQuery({
        queryKey: [COURSES_QUERY_KEY, filters],
        queryFn: () => coursesService.getAllCourses(filters),
    });

    // Get course by ID query
    const getCourseByIdQuery = (courseId: string) =>
        useQuery({
            queryKey: [COURSES_QUERY_KEY, courseId],
            queryFn: () => coursesService.getCourseById(courseId),
            enabled: !!courseId,
        });

    // Get course enrollments query
    const getCourseEnrollmentsQuery = (courseId: string, page = 1, limit = 10) =>
        useQuery({
            queryKey: [COURSES_QUERY_KEY, courseId, "enrollments", page, limit],
            queryFn: () => coursesService.getCourseEnrollments(courseId, page, limit),
            enabled: !!courseId,
        });

    // Get course stats query
    const getCourseStatsQuery = useQuery({
        queryKey: [COURSE_STATS_QUERY_KEY],
        queryFn: () => coursesService.getCourseStats(),
    });

    // Create course mutation
    const createCourseMutation = useMutation({
        mutationFn: async (data: CreateCourseDto) => {
            try {
                const response = await coursesService.createCourse(data);
                toast.success("Course created successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to create course");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSE_STATS_QUERY_KEY] });
        },
    });

    // Update course mutation
    const updateCourseMutation = useMutation({
        mutationFn: async ({ courseId, data }: { courseId: string; data: UpdateCourseDto }) => {
            try {
                const response = await coursesService.updateCourse(courseId, data);
                toast.success("Course updated successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update course");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY, variables.courseId] });
            queryClient.invalidateQueries({ queryKey: [COURSE_STATS_QUERY_KEY] });
        },
    });

    // Delete course mutation
    const deleteCourseMutation = useMutation({
        mutationFn: async (courseId: string) => {
            try {
                await coursesService.deleteCourse(courseId);
                toast.success("Course deleted successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete course");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSE_STATS_QUERY_KEY] });
        },
    });

    // Toggle listing mutation
    const toggleListingMutation = useMutation({
        mutationFn: async ({ courseId, isListed }: { courseId: string; isListed: boolean }) => {
            try {
                const response = await coursesService.toggleListing(courseId, isListed);
                toast.success(`Course ${isListed ? "listed" : "unlisted"} successfully`);
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update course listing");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY, variables.courseId] });
            queryClient.invalidateQueries({ queryKey: [COURSE_STATS_QUERY_KEY] });
        },
    });

    // Toggle popular mutation
    const togglePopularMutation = useMutation({
        mutationFn: async ({ courseId, isPopular }: { courseId: string; isPopular: boolean }) => {
            try {
                const response = await coursesService.togglePopular(courseId, isPopular);
                toast.success(`Course ${isPopular ? "marked as popular" : "removed from popular"}`);
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to update course popular status");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY, variables.courseId] });
            queryClient.invalidateQueries({ queryKey: [COURSE_STATS_QUERY_KEY] });
        },
    });

    // Upload thumbnail mutation
    const uploadThumbnailMutation = useMutation({
        mutationFn: async ({ courseId, thumbnail }: { courseId: string; thumbnail: File }) => {
            try {
                const response = await coursesService.uploadThumbnail(courseId, thumbnail);
                toast.success("Thumbnail uploaded successfully");
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to upload thumbnail");
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY, variables.courseId] });
        },
    });

    // Sync from Teachable mutation
    const syncFromTeachableMutation = useMutation({
        mutationFn: async () => {
            try {
                const response = await coursesService.syncFromTeachable();
                toast.success(`Synced ${response.synced} courses successfully`);
                return response;
            } catch (error: any) {
                toast.error(error.message || "Failed to sync courses from Teachable");
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSE_STATS_QUERY_KEY] });
        },
    });

    return {
        // Queries
        getCoursesQuery,
        getCourseByIdQuery,
        getCourseEnrollmentsQuery,
        getCourseStatsQuery,

        // Mutations
        createCourse: createCourseMutation,
        updateCourse: updateCourseMutation,
        deleteCourse: deleteCourseMutation,
        toggleListing: toggleListingMutation,
        togglePopular: togglePopularMutation,
        uploadThumbnail: uploadThumbnailMutation,
        syncFromTeachable: syncFromTeachableMutation,
    };
};
