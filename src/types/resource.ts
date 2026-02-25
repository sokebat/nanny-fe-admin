export enum ResourceType {
    PDF = "pdf",
    VIDEO = "video",
    AUDIO = "audio",
    ARTICLE = "article",
    LINK = "link",
    OTHER = "other",
}

export const RESOURCE_TYPE_OPTIONS: { value: ResourceType; label: string }[] = [
    { value: ResourceType.PDF, label: "PDF" },
    { value: ResourceType.VIDEO, label: "Video" },
    { value: ResourceType.AUDIO, label: "Audio" },
    { value: ResourceType.ARTICLE, label: "Article" },
    { value: ResourceType.LINK, label: "Link" },
    { value: ResourceType.OTHER, label: "Other" },
];

export type TargetAudience = "nanny" | "parent" | "vendor";

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
    fileUrl?: string;
    thumbnailUrl?: string;
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

export type UpdateResourceDto = Partial<CreateResourceDto>;

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
