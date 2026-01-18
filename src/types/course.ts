export interface Course {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    price: number;
    videoUrl?: string;
    teachableCourseId?: string;
    thumbnail?: string;
    isActive: boolean;
    isListed: boolean;
    isPopular: boolean;
    enrollmentCount: number;
    ratingAverage: number;
    ratingCount: number;
    createdBy: string;
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
    totalCourses: number;
    listedCourses: number;
    popularCourses: number;
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
}

export interface SyncTeachableResponse {
    synced: number;
    errors: number;
}

