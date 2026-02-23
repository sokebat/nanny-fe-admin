export type ResourceType = 'pdf' | 'video' | 'audio' | 'article' | 'link' | 'other';

/** Display options for filter/forms — only these six types. */
export const RESOURCE_TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'article', label: 'Article' },
    { value: 'link', label: 'Link' },
    { value: 'other', label: 'Other' },
];

export type TargetAudience = 'caregiver' | 'family' | 'vendor';

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
    free?: boolean;
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
    free?: boolean;
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
    resources: {
        total: number;
        listed: number;
        popular: number;
    };
    views: {
        total: number;
    };
}
