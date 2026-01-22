export interface Course {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    price: number;
    videoUrl?: string;
    teachableCourseId?: string;
    thumbnail?: string;
    thumbnailUrl?: string; // API response field
    isActive: boolean;
    isListed: boolean;
    isPopular: boolean;
    enrollmentCount: number;
    ratingAverage: number;
    ratingCount: number;
    createdBy: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface CreateCourseDto {
    title: string;
    description?: string;
    category?: string;
    price: number;
    videoUrl?: string;
    teachableCourseId?: string;
    isListed?: boolean;
    isPopular?: boolean;
    thumbnail?: File;
}

export interface UpdateCourseDto {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    videoUrl?: string;
    teachableCourseId?: string;
    isListed?: boolean;
    isPopular?: boolean;
    thumbnail?: File;
}

export interface CourseFilters {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface CourseEnrollment {
    _id: string;
    userId: string;
    courseId: string;
    enrolledAt: string;
    completedAt?: string;
    progress?: number;
    user?: {
        name: string;
        email: string;
    };
}

export interface CourseStats {
    courses: {
        total: number;
        listed: number;
        popular: number;
    };
    enrollments: {
        total: number;
        active: number;
        completed: number;
    };
}

export interface SyncTeachableResponse {
    synced: number;
    errors: number;
}

export interface CoursesListResponse {
    courses: Course[];
    pagination: {
        page: string;
        limit: string;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface PaginatedData<T> {
    data: T[];
    pagination: {
        page: string;
        limit: string;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

