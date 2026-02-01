"use client";

import { Review } from "@/types/admin-reviews";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User, UserCheck, MessageSquare, ShieldCheck, Mail, Info } from "lucide-react";
import { format } from "date-fns";

interface ReviewDetailsDialogProps {
    review: Review | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ReviewDetailsDialog({ review, isOpen, onClose }: ReviewDetailsDialogProps) {
    if (!review) return null;

    const renderRating = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-4 ${star <= rating ? "fill-orange-400 text-orange-400" : "text-slate-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        Review Details
                    </DialogTitle>
                    <DialogDescription>
                        Complete review information and feedback details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Summary Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-bold">
                                            Rating: {review.rating}.0
                                        </CardTitle>
                                        {renderRating(review.rating)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Submitted on {format(new Date(review.createdAt), "PPP")}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={review.isDeleted ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"}>
                                        {review.isDeleted ? "Deleted" : "Active"}
                                    </Badge>
                                    <Badge className={review.isVerified ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                                        {review.isVerified ? "Verified" : "Pending Verification"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Participants Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Participants
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="size-3" /> Reviewer
                                    </p>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="font-semibold text-slate-900">
                                            {review.reviewerId.firstName} {review.reviewerId.lastName}
                                        </p>
                                        <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold text-slate-500 border-slate-200">
                                            {review.reviewerRole}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <UserCheck className="size-3" /> Reviewee
                                    </p>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="font-semibold text-slate-900">
                                            {review.revieweeId.firstName} {review.revieweeId.lastName}
                                        </p>
                                        <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold text-slate-500 border-slate-200">
                                            {review.revieweeRole}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comment Section */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Feedback Comment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 italic text-slate-700 leading-relaxed">
                                "{review.comment}"
                            </div>
                        </CardContent>
                    </Card>

                    {/* Meta/Status Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Review Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Verification Status</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        <ShieldCheck className={`size-4 ${review.isVerified ? "text-green-600" : "text-slate-400"}`} />
                                        {review.isVerified ? "Officially Verified" : "Pending Review"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Visibility</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${review.isDeleted ? "bg-red-500" : "bg-green-500"}`} />
                                        {review.isDeleted ? "Hidden from public" : "Visible to everyone"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Dates */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Important Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="font-medium text-sm mt-1">{format(new Date(review.createdAt), "PPP p")}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated At</p>
                                    <p className="font-medium text-sm mt-1">{format(new Date(review.createdAt), "PPP p")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
