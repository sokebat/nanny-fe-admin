import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Eye,
    Loader2,
    Star,
    Globe,
    FileText,
    Video,
    Volume2,
    Link as LinkIcon,
    MoreHorizontal,
    Pencil
} from "lucide-react";
import type { Resource, ResourceType } from "@/types/resource";
import { RESOURCE_TYPE_OPTIONS } from "@/types/resource";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ResourcesTableProps {
    resources: Resource[];
    onView?: (resourceId: string) => void;
    onEdit?: (resourceId: string) => void;
    onDelete?: (resourceId: string) => void;
    onToggleListing?: (resourceId: string, isListed: boolean) => void;
    onTogglePopular?: (resourceId: string, isPopular: boolean) => void;
    isDeleting?: boolean;
}

const TypeIcon = ({ type }: { type: ResourceType }) => {
    switch (type) {
        case "pdf": return <FileText className="w-4 h-4 text-orange-500" />;
        case "video": return <Video className="w-4 h-4 text-blue-500" />;
        case "audio": return <Volume2 className="w-4 h-4 text-purple-500" />;
        case "article":
        case "link": return <LinkIcon className="w-4 h-4 text-green-500" />;
        default: return <MoreHorizontal className="w-4 h-4 text-gray-400" />;
    }
};

export function ResourcesTable({
    resources,
    onView,
    onEdit,
    onDelete,
    onToggleListing,
    onTogglePopular,
    isDeleting = false,
}: ResourcesTableProps) {
    if (resources.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed">
                <p className="text-muted-foreground font-medium">No resources found in the library.</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card shadow-none overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="py-4 font-semibold text-brand-navy">Resource</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy">Type</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy">Category</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy text-center">Free</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy text-center">Popular</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy text-center">Listed</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy">Views</TableHead>
                        <TableHead className="py-4 font-semibold text-brand-navy text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resources.map((resource) => (
                        <TableRow key={resource._id} className="group transition-colors hover:bg-muted/20">
                            <TableCell className="py-4">
                                <div className="flex flex-col gap-0.5">
                                    <Link
                                        href={`/resources/${resource._id}`}
                                        className="font-bold text-foreground group-hover:text-brand-navy transition-colors hover:underline underline-offset-4"
                                    >
                                        {resource.title}
                                    </Link>
                                    {resource.description && (
                                        <span className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                                            {resource.description}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                    <TypeIcon type={resource.type} />
                                    <span className="text-sm font-medium">
                                        {RESOURCE_TYPE_OPTIONS.find((o) => o.value === resource.type)?.label ?? resource.type}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-sm font-medium">
                                <span className="bg-gray-100 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider text-muted-foreground">
                                    {resource.category || "Uncategorized"}
                                </span>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                {resource.free ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Free
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground text-xs">—</span>
                                )}
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onTogglePopular?.(resource._id, !resource.isPopular)}
                                    className={cn(
                                        "h-8 w-8 p-0 rounded-full transition-all border",
                                        resource.isPopular
                                            ? "text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 shadow-sm shadow-yellow-500/10"
                                            : "text-slate-300 border-transparent hover:bg-slate-50 hover:text-slate-400"
                                    )}
                                    title={resource.isPopular ? "Popular (Click to remove)" : "Mark as Popular"}
                                >
                                    <Star className={cn("w-4 h-4", resource.isPopular && "fill-current")} />
                                </Button>
                            </TableCell>
                            <TableCell className="py-4 text-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onToggleListing?.(resource._id, !resource.isListed)}
                                    className={cn(
                                        "h-8 w-8 p-0 rounded-full transition-all border",
                                        resource.isListed
                                            ? "text-green-600 bg-green-50 border-green-200 hover:bg-green-100 shadow-sm shadow-green-500/10"
                                            : "text-slate-300 border-transparent hover:bg-slate-50 hover:text-slate-400"
                                    )}
                                    title={resource.isListed ? "Listed (Click to unlist)" : "List Resource"}
                                >
                                    <Globe className="w-4 h-4" />
                                </Button>
                            </TableCell>
                            <TableCell className="py-4 font-mono text-xs">{resource.viewCount.toLocaleString()}</TableCell>
                            <TableCell className="py-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-500 hover:bg-brand-navy/5 hover:text-brand-navy transition-all"
                                        title="View Details"
                                    >
                                        <Link href={`/resources/${resource._id}`}>
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    {onEdit && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:bg-brand-navy/5 hover:text-brand-navy transition-all"
                                            onClick={() => onEdit(resource._id)}
                                            title="Edit Resource"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 transition-all focus:ring-0"
                                            onClick={() => onDelete(resource._id)}
                                            disabled={isDeleting}
                                            title="Delete Resource"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
