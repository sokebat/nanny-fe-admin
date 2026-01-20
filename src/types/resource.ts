export type ResourceType = 'pdf' | 'video' | 'audio' | 'article' | 'link' | 'other';
export type TargetAudience = 'caregiver' | 'parent' | 'vendor';

export interface Resource {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    type: ResourceType;
    url?: string;
    isActive: boolean;
    isListed: boolean;
    isPopular: boolean;
    targetAudience: TargetAudience[];
    teachableResourceId?: string;
    fileUrl?: string; // S3 URL
    thumbnailUrl?: string; // S3 URL
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResourceDto {
    title: string;
    description?: string;
    category?: string;
    type: ResourceType;
    url?: string;
    isActive?: boolean;
    isListed?: boolean;
    isPopular?: boolean;
    targetAudience?: TargetAudience[];
    teachableResourceId?: string;
    file?: File;
    thumbnail?: File;
}

export interface UpdateResourceDto extends Partial<CreateResourceDto> { }

export interface ResourceFilters {
    page?: number;
    limit?: number;
    category?: string;
    type?: ResourceType;
    search?: string;
    targetAudience?: TargetAudience;
}

export interface ResourcesListResponse {
    resources: Resource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ResourceStatsBase {
    totalResources: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    popularCount: number;
    activeCount: number;
    listedCount: number;
}
