"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/image-upload";
import type { Resource, CreateResourceDto, TargetAudience } from "@/types/resource";
import { RESOURCE_TYPE_OPTIONS, ResourceType } from "@/types/resource";
import { Loader2, FileText, X, Check, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resource: Resource | null;
    onSubmit: (data: CreateResourceDto) => Promise<void>;
    isSubmitting: boolean;
}

type ToggleField = "isActive" | "isListed" | "isPopular" | "free";
type ToggleOption = { id: ToggleField; label: string; watched: boolean | undefined };

const ALLOWED_AUDIENCES: TargetAudience[] = ["nanny", "parent", "vendor"];

const isTargetAudience = (value: string): value is TargetAudience => {
    return ALLOWED_AUDIENCES.includes(value as TargetAudience);
};

const normalizeTargetAudience = (value: unknown, depth = 0): TargetAudience[] => {
    if (!value || depth > 5) return [];

    if (Array.isArray(value)) {
        for (const item of value) {
            const normalized = normalizeTargetAudience(item, depth + 1);
            if (normalized.length > 0) return [normalized[0]];
        }
        return [];
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return [];

        const lower = trimmed.toLowerCase();
        if (isTargetAudience(lower)) return [lower];

        if (trimmed.includes(",")) {
            return normalizeTargetAudience(trimmed.split(","), depth + 1);
        }

        if (trimmed.startsWith("[") || trimmed.startsWith("\"")) {
            try {
                return normalizeTargetAudience(JSON.parse(trimmed), depth + 1);
            } catch {
                return [];
            }
        }
    }

    return [];
};

export function ResourceForm({
    open,
    onOpenChange,
    resource,
    onSubmit,
    isSubmitting,
}: ResourceFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const thumbnailUploadId = useId();
    const fileUploadId = useId();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<CreateResourceDto>({
        defaultValues: {
            title: "",
            description: "",
            category: "",
            type: ResourceType.PDF,
            url: "",
            teachableResourceId: "",
            isActive: true,
            isListed: true,
            isPopular: false,
            free: false,
            targetAudience: [],
        },
    });

    const watchType = watch("type");
    const watchIsActive = watch("isActive");
    const watchIsListed = watch("isListed");
    const watchIsPopular = watch("isPopular");
    const watchFree = watch("free");
    const watchTargetAudience = normalizeTargetAudience(watch("targetAudience"));

    // Helper to get thumbnail URL
    const getThumbnailUrl = (url?: string): string | undefined => {
        if (!url || url.trim() === "") return undefined;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    useEffect(() => {
        if (resource) {
            reset({
                title: resource.title,
                description: resource.description || "",
                category: resource.category || "",
                type: resource.type,
                url: resource.url || "",
                teachableResourceId: resource.teachableResourceId || "",
                isActive: resource.isActive,
                isListed: resource.isListed,
                isPopular: resource.isPopular,
                free: resource.free ?? false,
                targetAudience: normalizeTargetAudience(resource.targetAudience),
            });
            clearErrors("targetAudience");
            setThumbnailPreview(getThumbnailUrl(resource.thumbnailUrl) || null);
        } else {
            reset({
                title: "",
                description: "",
                category: "",
                type: ResourceType.PDF,
                url: "",
                teachableResourceId: "",
                isActive: true,
                isListed: true,
                isPopular: false,
                free: false,
                targetAudience: [],
            });
            clearErrors("targetAudience");
            setFile(null);
            setThumbnail(null);
            setThumbnailPreview(null);
        }
    }, [resource, reset, open, clearErrors]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (thumbnailPreview && thumbnail) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview, thumbnail]);

    const handleThumbnailUpload = (nextFile: File) => {
        setThumbnail((prev) => {
            if (prev && thumbnailPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(thumbnailPreview);
            }
            return nextFile;
        });
        const preview = URL.createObjectURL(nextFile);
        setThumbnailPreview(preview);
    };

    const handleFileChange = (nextFile: File | null) => {
        setFile(nextFile);
        if (nextFile) {
            setFileError(null);
        }
    };

    const allowedAcceptByType: Record<ResourceType, string | undefined> = {
        [ResourceType.PDF]: ".pdf,application/pdf",
        [ResourceType.AUDIO]: "audio/*",
        [ResourceType.VIDEO]: "video/*",
        [ResourceType.ARTICLE]: undefined,
        [ResourceType.LINK]: undefined,
        [ResourceType.OTHER]: undefined,
    };

    const handleFormSubmit = async (data: CreateResourceDto) => {
        const normalizedAudience = normalizeTargetAudience(data.targetAudience);
        if (normalizedAudience.length === 0) {
            setError("targetAudience", {
                type: "manual",
                message: "Please select one target audience.",
            });
            return;
        }

        const trimmedUrl = data.url?.trim() ?? "";
        const requiresUrl = data.type === ResourceType.LINK || data.type === ResourceType.ARTICLE;
        const requiresUpload =
            data.type === ResourceType.PDF ||
            data.type === ResourceType.AUDIO ||
            data.type === ResourceType.VIDEO;

        if (requiresUrl && !trimmedUrl) {
            setError("url", {
                type: "manual",
                message: "URL is required for link or article resources.",
            });
            return;
        }

        if (!trimmedUrl) {
            clearErrors("url");
        }

        if (requiresUpload && !file && !resource?.fileUrl) {
            setFileError("Please upload a file for PDF, audio, or video resources.");
            return;
        }

        setFileError(null);

        const payload: CreateResourceDto = {
            ...data,
            url: trimmedUrl || undefined,
            targetAudience: normalizedAudience,
            file: file || undefined,
            thumbnail: thumbnail || undefined,
        };
        await onSubmit(payload);
    };

    const audiences: { label: string; value: TargetAudience }[] = [
        { label: "Nanny", value: "nanny" },
        { label: "Parent", value: "parent" },
        { label: "Vendor", value: "vendor" },
    ];

    const selectAudience = (value: TargetAudience) => {
        setValue("targetAudience", [value]);
        clearErrors("targetAudience");
    };

    const toggleOptions: ToggleOption[] = [
        { id: "isActive", label: "Active", watched: watchIsActive },
        { id: "isListed", label: "Listed", watched: watchIsListed },
        { id: "isPopular", label: "Popular", watched: watchIsPopular },
        { id: "free", label: "Free", watched: watchFree },
    ];

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white p-0">
                <SheetHeader className="p-8 pb-6 border-b">
                    <SheetTitle className="text-2xl font-bold">
                        {resource ? "Edit Resource" : "Upload Resource"}
                    </SheetTitle>
                    <SheetDescription>
                        Configuration and metadata for the library resource.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 pt-6 space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-semibold">
                                    Resource Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter resource title"
                                    {...register("title", { required: "Title is required" })}
                                    className={cn(
                                        "h-11",
                                        errors.title && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-sm font-semibold">Type</Label>
                                <Select
                                    value={watchType}
                                    onValueChange={(val) => setValue("type", val as ResourceType)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {RESOURCE_TYPE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g. Education, Health, Nanny"
                                    {...register("category")}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-sm font-semibold">URL (External Content)</Label>
                                <Input
                                    id="url"
                                    placeholder="https://example.com/resource"
                                    {...register("url")}
                                    className={cn(
                                        "h-11",
                                        errors.url && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                />
                                {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Provide a brief summary or details about this resource..."
                                className="min-h-[120px] resize-none"
                                {...register("description")}
                            />
                        </div>
                    </div>

                    {/* Target Audience & Visibility */}
                    <div className="space-y-6 pt-6 border-t">
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold">Target Audience</Label>
                            <div className="flex flex-wrap gap-4">
                                {audiences.map((audience) => {
                                    const isSelected = watchTargetAudience.includes(audience.value);
                                    return (
                                        <button
                                            key={audience.value}
                                            type="button"
                                            onClick={() => selectAudience(audience.value)}
                                            aria-pressed={isSelected}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
                                                isSelected
                                                    ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                                                    : "bg-white text-muted-foreground border-gray-200 hover:border-brand-navy hover:text-brand-navy"
                                            )}
                                        >
                                            {isSelected && <Check className="w-3.5 h-3.5" />}
                                            {audience.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.targetAudience && (
                                <p className="text-xs text-red-500">{errors.targetAudience.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {toggleOptions.map((toggle) => (
                                <button
                                    key={toggle.id}
                                    type="button"
                                    onClick={() => setValue(toggle.id, !toggle.watched)}
                                    aria-pressed={Boolean(toggle.watched)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                                        toggle.watched
                                            ? "bg-brand-navy text-white border-brand-navy"
                                            : "bg-gray-50 border-transparent text-muted-foreground"
                                    )}
                                >
                                    <span className="text-sm font-semibold">{toggle.label}</span>
                                    <div className={cn(
                                        "w-10 h-5 rounded-full relative transition-colors",
                                        toggle.watched ? "bg-brand-navy" : "bg-gray-300"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all",
                                            toggle.watched ? "right-0.5" : "left-0.5"
                                        )} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Media Assets */}
                    <div className="space-y-6 pt-6 border-t font-inter">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Thumbnail Image</Label>
                                {thumbnailPreview ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-muted/20">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                type="button"
                                                className="h-8"
                                                onClick={() => document.getElementById(thumbnailUploadId)?.click()}
                                            >
                                                Change Image
                                            </Button>
                                            {(thumbnail || resource?.thumbnailUrl) && (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    type="button"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setThumbnail(null);
                                                        setThumbnailPreview(null);
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        {thumbnail && (
                                            <div className="absolute top-2 left-2 bg-brand-navy text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                NEW UPLOAD
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => document.getElementById(thumbnailUploadId)?.click()}
                                        className="h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors border-gray-200"
                                    >
                                        <UploadCloud className="w-6 h-6 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">Select Thumbnail</span>
                                    </div>
                                )}
                                <div className="hidden">
                                    <ImageUpload
                                        id={thumbnailUploadId}
                                        onUpload={handleThumbnailUpload}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Resource File (PDF/Audio)</Label>
                                <div className="relative h-32">
                                    <input
                                        type="file"
                                        id={fileUploadId}
                                        className="sr-only"
                                        accept={allowedAcceptByType[watchType]}
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    />
                                    <label
                                        htmlFor={fileUploadId}
                                        className={cn(
                                            "h-full w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-4",
                                            file
                                                ? "border-brand-navy bg-brand-navy/5 text-brand-navy"
                                                : "border-gray-200 hover:border-brand-navy hover:bg-muted/30 text-muted-foreground"
                                        )}
                                    >
                                        <FileText className={cn("w-6 h-6", file && "text-brand-navy")} />
                                        <div className="text-center">
                                            {file ? (
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-[10px] opacity-70">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium">Click to select asset</span>
                                            )}
                                        </div>
                                    </label>
                                    {file && (
                                        <button
                                            type="button"
                                            onClick={() => handleFileChange(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                {resource?.fileUrl && !file && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-xs font-medium text-muted-foreground">Current shared resource</span>
                                        </div>
                                        <a
                                            href={resource.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[10px] uppercase font-bold text-brand-navy hover:underline"
                                        >
                                            Open File
                                        </a>
                                    </div>
                                )}
                                {fileError && <p className="text-xs text-red-500">{fileError}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="pt-8 border-t">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-navy hover:bg-[#203a56] text-white h-12 rounded-xl shadow-none transition-all font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {resource ? "Finalizing Updates..." : "Publishing Resource..."}
                                </>
                            ) : (
                                resource ? "Save Changes" : "Publish Resource"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
