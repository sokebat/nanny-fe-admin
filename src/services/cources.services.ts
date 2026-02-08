import { ApiService } from "./api.services";
import type { AxiosRequestConfig } from "axios";
import type {
    Course,
    CreateCourseDto,
    UpdateCourseDto,
    CourseFilters,
    CourseEnrollment,
    CourseStats,
    SyncTeachableResponse,
    CoursesListResponse,
    PaginatedData,
} from "@/types/course";
import type { ApiResponse } from "@/types/subscription"; 
 

class CoursesService extends ApiService {
    /**
     * Get all courses with filters (Admin only)
     */
    async getAllCourses(filters: CourseFilters = {}): Promise<CoursesListResponse> {
        const params = new URLSearchParams();
        
        if (filters.page) params.append("page", String(filters.page));
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.search) params.append("search", filters.search);
        if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));
        if (filters.targetAudience) params.append("targetAudience", filters.targetAudience);

        const queryString = params.toString();
        const endpoint = `/admin/courses${queryString ? `?${queryString}` : ""}`;
        
        const response = await this.get<ApiResponse<CoursesListResponse>>(endpoint, true);
        return response.data;
    }

    /**
     * Get course details by ID (Admin only)
     */
    async getCourseById(courseId: string): Promise<Course> {
        const response = await this.get<ApiResponse<{ course: Course }>>(
            `/admin/courses/${courseId}`,
            true
        );
        return response.data.course;
    }

    /**
     * Create a new course (Admin only)
     * Uses FormData for file upload support
     */
    async createCourse(data: CreateCourseDto): Promise<Course> {
        const formData = new FormData();
        
        formData.append("title", data.title);
        formData.append("price", String(data.price));
        
        if (data.description) formData.append("description", data.description);
  
        if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
        if (data.teachableCourseId) formData.append("teachableCourseId", data.teachableCourseId);
        if (data.isListed !== undefined) formData.append("isListed", String(data.isListed));
        if (data.isPopular !== undefined) formData.append("isPopular", String(data.isPopular));
        if (data.targetAudience) formData.append("targetAudience", JSON.stringify(data.targetAudience));
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await this.post<ApiResponse<{ course: Course }>>(
            "/admin/courses",
            formData,
            true,
            config
        );
        return response.data.course;
    }

    /**
     * Update an existing course (Admin only)
     * Uses FormData for file upload support
     */
    async updateCourse(courseId: string, data: UpdateCourseDto): Promise<Course> {
        const formData = new FormData();
        
        if (data.title) formData.append("title", data.title);
        if (data.description !== undefined) formData.append("description", data.description);
   
        if (data.price !== undefined) formData.append("price", String(data.price));
        if (data.videoUrl) formData.append("videoUrl", data.videoUrl);
        if (data.teachableCourseId) formData.append("teachableCourseId", data.teachableCourseId);
        if (data.isListed !== undefined) formData.append("isListed", String(data.isListed));
        if (data.isPopular !== undefined) formData.append("isPopular", String(data.isPopular));
        if (data.targetAudience !== undefined) formData.append("targetAudience", JSON.stringify(data.targetAudience));
        if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await this.patch<ApiResponse<{ course: Course }>>(
            `/admin/courses/${courseId}`,
            formData,
            true,
            config
        );
        return response.data.course;
    }

    /**
     * Toggle course listing status (Admin only)
     */
    async toggleListing(courseId: string, isListed: boolean): Promise<Course> {
        const response = await this.patch<ApiResponse<{ course: Course }>>(
            `/admin/courses/${courseId}/toggle-listing`,
            { isListed },
            true,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.course;
    }

    /**
     * Toggle course popular status (Admin only)
     */
    async togglePopular(courseId: string, isPopular: boolean): Promise<Course> {
        const response = await this.patch<ApiResponse<{ course: Course }>>(
            `/admin/courses/${courseId}/toggle-popular`,
            { isPopular },
            true,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.course;
    }

    /**
     * Upload or update course thumbnail (Admin only)
     */
    async uploadThumbnail(courseId: string, thumbnail: File): Promise<Course> {
        const formData = new FormData();
        formData.append("thumbnail", thumbnail);

        const config: AxiosRequestConfig = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        const response = await this.post<ApiResponse<{ course: Course }>>(
            `/admin/courses/${courseId}/thumbnail`,
            formData,
            true,
            config
        );
        return response.data.course;
    }

    /**
     * Delete a course (Admin only)
     * Only allowed if course has no enrollments
     */
    async deleteCourse(courseId: string): Promise<void> {
        await this.delete<ApiResponse<void>>(`/admin/courses/${courseId}`, true);
    }

    /**
     * Sync courses from Teachable (Admin only)
     */
    async syncFromTeachable(): Promise<SyncTeachableResponse> {
        const response = await this.post<ApiResponse<SyncTeachableResponse>>(
            "/admin/courses/sync-teachable",
            {},
            true
        );
        return response.data;
    }

    /**
     * Get course enrollments (Admin only)
     */
    async getCourseEnrollments(
        courseId: string,
        page = 1,
        limit = 10
    ): Promise<PaginatedData<CourseEnrollment>> {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));

        const response = await this.get<ApiResponse<PaginatedData<CourseEnrollment>>>(
            `/admin/courses/${courseId}/enrollments?${params.toString()}`,
            true
        );
        return response.data;
    }

    /**
     * Get course statistics (Admin only)
     */
    async getCourseStats(): Promise<CourseStats> {
        const response = await this.get<ApiResponse<CourseStats>>(
            "/admin/courses/stats",
            true
        );
        return response.data;
    }
}

export const coursesService = new CoursesService();
