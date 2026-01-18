"use client";

import { useEffect, useState } from "react";
import React from "react";
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
import type { CreateCourseDto, UpdateCourseDto, Course } from "@/types/course";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CourseFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: Course | null;
    onSubmit: (data: CreateCourseDto) => Promise<void>;
    isSubmitting: boolean;
}

export function CourseForm({
    open,
    onOpenChange,
    course,
    onSubmit,
    isSubmitting,
}: CourseFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<CreateCourseDto>({
        defaultValues: {
            title: "",
            description: "",
            category: "",
            price: 0,
            videoUrl: "",
            teachableCourseId: "",
            isListed: true,
            isPopular: false,
        },
    });

    const isListedValue = watch("isListed");
    const isPopularValue = watch("isPopular");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    // Get thumbnail URL - handle both relative and absolute URLs
    const getThumbnailUrl = (thumbnail?: string): string | undefined => {
        if (!thumbnail || thumbnail.trim() === "") return undefined;
        // If already a full URL, return as is
        if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
            return thumbnail;
        }
        // If relative URL, prepend API base URL
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        return `${baseURL}${thumbnail.startsWith("/") ? "" : "/"}${thumbnail}`;
    };

    // Check both thumbnail and thumbnailUrl fields (API uses thumbnailUrl)
    const courseThumbnail = course?.thumbnailUrl || course?.thumbnail;
    const currentThumbnailUrl = courseThumbnail && courseThumbnail.trim() !== "" 
        ? getThumbnailUrl(courseThumbnail) 
        : undefined;

    // Load edit data when course is selected
    useEffect(() => {
        if (course) {
            setValue("title", course.title);
            setValue("description", course.description || "");
            setValue("category", course.category || "");
            setValue("price", course.price);
            setValue("videoUrl", course.videoUrl || "");
            setValue("teachableCourseId", course.teachableCourseId || "");
            setValue("isListed", course.isListed);
            setValue("isPopular", course.isPopular);
        } else {
            reset();
        }
        setThumbnailFile(null);
        setThumbnailPreview(null);
    }, [course, setValue, reset]);

    // Cleanup preview URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    const handleUpload = (file: File) => {
        setThumbnailFile(file);
        // Create preview URL for the selected file
        const preview = URL.createObjectURL(file);
        setThumbnailPreview(preview);
    };

    const handleFormSubmit = async (data: CreateCourseDto) => {
        const courseData: CreateCourseDto = {
            ...data,
            price: Number(data.price),
            thumbnail: thumbnailFile || undefined,
        };
        await onSubmit(courseData);
        if (!course) {
            reset();
            setThumbnailFile(null);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="pb-6 border-b">
                    <SheetTitle className="text-2xl font-bold">
                        {course ? "Edit Course" : "Upload Course"}
                    </SheetTitle>
                    <SheetDescription className="text-sm">Basic Information</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-8 space-y-8 px-1">
                    <div className="space-y-6">
                        <div>
                            <Label className="text-sm font-semibold">Thumbnail Image</Label>
                            <div className="mt-3 space-y-3">
                                {/* Debug info - show what we're getting */}
                                {process.env.NODE_ENV === "development" && course && (
                                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                                        <div>Edit Mode: {course ? "Yes" : "No"}</div>
                                        <div>Thumbnail Value: {courseThumbnail || "empty"}</div>
                                        <div>Constructed URL: {currentThumbnailUrl || "none"}</div>
                                        <div>Has Preview: {thumbnailPreview ? "Yes" : "No"}</div>
                                    </div>
                                )}
                                
                                {/* Current Image Preview - Show when editing and no new preview */}
                                {course && currentThumbnailUrl && !thumbnailPreview && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-foreground">Current Thumbnail:</p>
                                        <div className="relative w-full h-56 rounded-lg border-2 border-border overflow-hidden bg-muted/20 shadow-sm">
                                            <img
                                                src={currentThumbnailUrl}
                                                alt="Current course thumbnail"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error("Failed to load thumbnail:", {
                                                        original: courseThumbnail,
                                                        constructed: currentThumbnailUrl,
                                                        error: e
                                                    });
                                                    // Show placeholder
                                                    const target = e.currentTarget;
                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
                                                }}
                                                onLoad={() => {
                                                    console.log("✓ Thumbnail loaded:", currentThumbnailUrl);
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Upload a new image below to replace the current thumbnail
                                        </p>
                                    </div>
                                )}

                                {/* Show message if no thumbnail exists */}
                                {course && !currentThumbnailUrl && !thumbnailPreview && (
                                    <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded border border-dashed">
                                        No thumbnail image for this course. Upload one below.
                                    </div>
                                )}

                                {/* New Image Preview - Show when new file is selected */}
                                {thumbnailPreview && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-foreground">New Thumbnail Preview:</p>
                                        <div className="relative w-full h-56 rounded-lg border-2 border-primary/50 overflow-hidden bg-muted/20 shadow-sm">
                                            <img
                                                src={thumbnailPreview}
                                                alt="New thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
                                                New Image
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Upload Area */}
                                <div className={thumbnailPreview || currentThumbnailUrl ? "pt-2" : ""}>
                                    <ImageUpload onUpload={handleUpload} />
                                </div>
                                
                                {/* File Info */}
                                {thumbnailFile && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Selected file:</span>
                                        <span className="font-medium text-foreground">{thumbnailFile.name}</span>
                                        <span className="text-muted-foreground">
                                            ({(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Course Title <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter course title"
                                    className={cn(
                                        "mt-2",
                                        errors.title && "border-destructive focus-visible:ring-destructive"
                                    )}
                                    {...register("title", {
                                        required: "Course title is required",
                                    })}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="category" className="text-sm font-medium">
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    placeholder="Enter category"
                                    className="mt-2"
                                    {...register("category")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price" className="text-sm font-medium">
                                    Price <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    placeholder="Enter price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={cn(
                                        "mt-2",
                                        errors.price && "border-destructive focus-visible:ring-destructive"
                                    )}
                                    {...register("price", {
                                        required: "Price is required",
                                        min: { value: 0, message: "Price must be positive" },
                                        valueAsNumber: true,
                                    })}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="videoUrl" className="text-sm font-medium">
                                    Preview Video URL
                                </Label>
                                <Input
                                    id="videoUrl"
                                    placeholder="https://example.com/video.mp4"
                                    type="url"
                                    className="mt-2"
                                    {...register("videoUrl")}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="teachableCourseId" className="text-sm font-medium">
                                    Teachable Course ID
                                </Label>
                                <Input
                                    id="teachableCourseId"
                                    placeholder="Enter Teachable course ID"
                                    className="mt-2"
                                    {...register("teachableCourseId")}
                                />
                            </div>
                            <div>
                                <Label htmlFor="isListed" className="text-sm font-medium">
                                    Listing Status
                                </Label>
                                <Select
                                    value={isListedValue ? "listed" : "unlisted"}
                                    onValueChange={(value) => setValue("isListed", value === "listed")}
                                >
                                    <SelectTrigger className="mt-2 w-full">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="listed">Listed</SelectItem>
                                        <SelectItem value="unlisted">Unlisted</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="isPopular" className="text-sm font-medium">
                                Popular Status
                            </Label>
                            <Select
                                value={isPopularValue ? "popular" : "not-popular"}
                                onValueChange={(value) => setValue("isPopular", value === "popular")}
                            >
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Popular</SelectItem>
                                    <SelectItem value="not-popular">Not Popular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-sm font-semibold">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Write details of your course..."
                                className="mt-3 min-h-[120px]"
                                {...register("description")}
                            />
                        </div>
                    </div>

                    <div className="py-8 border-t">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-navy hover:bg-[#2d4a6a] text-white h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : course ? (
                                "Update Course"
                            ) : (
                                "Upload Course"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}

