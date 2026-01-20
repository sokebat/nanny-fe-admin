"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResourceForm, DeleteResourceDialog } from "@/components/resources";
import { useResources } from "@/hooks/use-resources";
import type { CreateResourceDto, UpdateResourceDto } from "@/types/resource";
import {
    ArrowLeft,
    Loader2,
    Calendar,
    Eye,
    Trash2,
    FileText,
    Video,
    Globe,
    Star,
    ExternalLink,
    Download
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ResourceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const resourceId = params.slug as string;

    const [formOpen, setFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

    const {
        getResourceByIdQuery,
        updateResource,
        deleteResource,
        toggleListing,
        togglePopular,
    } = useResources();

    const resourceQuery = resourceId ? getResourceByIdQuery(resourceId) : null;
    const resource = resourceQuery?.data;

    const handleFormSubmit = async (data: CreateResourceDto) => {
        if (!resourceId) return;
        try {
            await updateResource.mutateAsync({
                resourceId,
                data: data as UpdateResourceDto,
            });
            setFormOpen(false);
            resourceQuery?.refetch();
        } catch (error) { /* Handled by hook */ }
    };

    const handleDelete = async () => {
        if (!resourceId) return;
        try {
            await deleteResource.mutateAsync(resourceId);
            setDeleteDialogOpen(false);
            router.push("/resources");
        } catch (error) { /* Handled by hook */ }
    };

    const handleToggleListing = async () => {
        if (!resourceId || !resource) return;
        setTogglingStatus("listing");
        try {
            await toggleListing.mutateAsync({
                resourceId,
                isListed: !resource.isListed,
            });
            await resourceQuery?.refetch();
        } finally { setTogglingStatus(null); }
    };

    const handleTogglePopular = async () => {
        if (!resourceId || !resource) return;
        setTogglingStatus("popular");
        try {
            await togglePopular.mutateAsync({
                resourceId,
                isPopular: !resource.isPopular,
            });
            await resourceQuery?.refetch();
        } finally { setTogglingStatus(null); }
    };

    if (resourceQuery?.isLoading) {
        return (
            <main className="flex-1 p-8 bg-muted min-h-screen">
                <div className="flex flex-col items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-navy mb-4" />
                    <p className="text-muted-foreground animate-pulse">Retrieving resource details...</p>
                </div>
            </main>
        );
    }

    if (resourceQuery?.isError || !resource) {
        return (
            <main className="flex-1 p-8 bg-white min-h-screen">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24">
                    <div className="bg-white p-8 rounded-2xl border text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h2 className="text-2xl font-bold text-foreground mb-2">Resource Not Found</h2>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            The resource you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push("/resources")} variant="outline" className="rounded-xl">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Library
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    const getFullImageUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    return (
        <main className="flex-1 p-8 overflow-auto bg-white">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/resources")}
                            className="p-0 hover:bg-transparent text-muted-foreground hover:text-brand-navy mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Library
                        </Button>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-4xl font-extrabold text-[#1E293B] tracking-tight">
                                {resource.title}
                            </h1>
                            {resource.category && (
                                <Badge className="bg-brand-navy/5 text-brand-navy hover:bg-brand-navy/10 border-none font-bold uppercase tracking-wider text-[10px] px-3">
                                    {resource.category}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setFormOpen(true)}
                            className="bg-brand-navy hover:bg-[#203a56] text-white rounded-xl h-11 px-6 shadow-none transition-all"
                        >
                            Edit Resource
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={deleteResource.isPending}
                            className="rounded-xl h-11 px-6 shadow-none"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Preview */}
                        <Card className="border shadow-none overflow-hidden rounded-2xl bg-white">
                            <CardContent className="p-0">
                                <div className="relative aspect-video bg-muted/20">
                                    {resource.thumbnailUrl ? (
                                        <img
                                            src={getFullImageUrl(resource.thumbnailUrl)}
                                            alt={resource.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                                            {resource.type === "video" ? <Video className="w-16 h-16" /> : <FileText className="w-16 h-16" />}
                                            <p className="mt-2 font-medium">No preview available</p>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge className="bg-white/90 backdrop-blur text-brand-navy border-none font-bold px-3 py-1 shadow-none">
                                            {resource.type.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-[#1E293B]">About this Resource</h3>
                            <Card className="border shadow-none rounded-2xl bg-white">
                                <CardContent className="p-6">
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {resource.description || "No description provided for this resource."}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Target Audience */}
                        {resource.targetAudience && resource.targetAudience.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#1E293B]">Intended Audience</h3>
                                <div className="flex flex-wrap gap-3">
                                    {resource.targetAudience.map((audience) => (
                                        <Badge
                                            key={audience}
                                            className="bg-white border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-medium hover:border-brand-navy hover:text-brand-navy transition-all shadow-none"
                                        >
                                            {audience.charAt(0).toUpperCase() + audience.slice(1)}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-8">
                        {/* Primary Action Card */}
                        <Card className="border shadow-none rounded-2xl bg-white overflow-hidden">
                            <div className="h-2 bg-brand-navy" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold">Access Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    {resource.fileUrl && (
                                        <Button
                                            asChild
                                            className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl h-12 font-bold"
                                        >
                                            <a href={getFullImageUrl(resource.fileUrl)} target="_blank" rel="noreferrer">
                                                <Download className="w-4 h-4 mr-2" />
                                                Download {resource.type.toUpperCase()}
                                            </a>
                                        </Button>
                                    )}
                                    {resource.url && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full rounded-xl h-12 border-slate-200 hover:border-brand-navy hover:text-brand-navy font-bold"
                                        >
                                            <a href={resource.url} target="_blank" rel="noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Open External Link
                                            </a>
                                        </Button>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <Eye className="w-5 h-5" />
                                        <span className="text-sm font-semibold tracking-wide uppercase">Total Views</span>
                                    </div>
                                    <span className="text-2xl font-black text-brand-navy">
                                        {resource.viewCount.toLocaleString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Visibility & Curation */}
                        <Card className="border shadow-none rounded-2xl bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Curation Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <button
                                    onClick={handleToggleListing}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                                        resource.isListed
                                            ? "bg-brand-navy/5 border-brand-navy/20 text-brand-navy"
                                            : "bg-slate-50 border-transparent text-slate-400"
                                    )}
                                >
                                    <div className="flex items-center gap-3 font-bold text-sm">
                                        <Globe className="w-4 h-4" />
                                        Listed in Directory
                                    </div>
                                    {togglingStatus === "listing" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <div className={cn("w-2 h-2 rounded-full", resource.isListed ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-300")} />
                                    )}
                                </button>

                                <button
                                    onClick={handleTogglePopular}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                                        resource.isPopular
                                            ? "bg-yellow-50/50 border-yellow-200 text-yellow-700"
                                            : "bg-slate-50 border-transparent text-slate-400"
                                    )}
                                >
                                    <div className="flex items-center gap-3 font-bold text-sm">
                                        <Star className={cn("w-4 h-4", resource.isPopular && "fill-current")} />
                                        Promote to Popular
                                    </div>
                                    {togglingStatus === "popular" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <div className={cn("w-2 h-2 rounded-full", resource.isPopular ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "bg-slate-300")} />
                                    )}
                                </button>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <div className="px-4 space-y-4">
                            <div className="flex items-center gap-4 text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <div className="text-xs space-y-1">
                                    <p>First published on <span className="text-slate-600 font-bold">{format(new Date(resource.createdAt), "MMMM dd, yyyy")}</span></p>
                                    <p>Last modified on <span className="text-slate-600 font-bold">{format(new Date(resource.updatedAt), "MMMM dd, yyyy")}</span></p>
                                </div>
                            </div>
                            {resource.teachableResourceId && (
                                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Teachable External ID</p>
                                    <p className="text-[11px] font-mono text-slate-600 break-all">{resource.teachableResourceId}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overlays */}
                <ResourceForm
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    resource={resource}
                    onSubmit={handleFormSubmit}
                    isSubmitting={updateResource.isPending}
                />

                <DeleteResourceDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDelete}
                    isDeleting={deleteResource.isPending}
                />
            </div>
        </main>
    );
}