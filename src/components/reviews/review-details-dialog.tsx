"use client";

import { Review } from "@/types/admin-reviews";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User, UserCheck, MessageSquare, ShieldCheck, Mail } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

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
                        className={`size-5 ${star <= rating ? "fill-orange-400 text-orange-400" : "text-slate-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white relative">
                    <DialogHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge className="mb-4 bg-orange-500 hover:bg-orange-600 text-white border-none px-3 py-1 font-outfit uppercase tracking-wider text-[10px]">
                                    Review Details
                                </Badge>
                                <DialogTitle className="text-3xl font-bold font-outfit mb-2">
                                    Rating: {review.rating}.0
                                </DialogTitle>
                                {renderRating(review.rating)}
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                <MessageSquare className="size-8 text-orange-400" />
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-8 bg-white">
                    {/* Users Section */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="size-3" /> Reviewer
                            </p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group transition-all hover:bg-slate-100">
                                <p className="font-bold text-slate-900 text-lg">
                                    {review.reviewerId.firstName} {review.reviewerId.lastName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 border-slate-200">
                                        {review.reviewerRole}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <UserCheck className="size-3" /> Reviewee
                            </p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group transition-all hover:bg-slate-100">
                                <p className="font-bold text-slate-900 text-lg">
                                    {review.revieweeId.firstName} {review.revieweeId.lastName}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 border-slate-200">
                                        {review.revieweeRole}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    {/* Content Section */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="size-3" /> Comment
                        </p>
                        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50 italic text-slate-700 leading-relaxed text-lg">
                            "{review.comment}"
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-3 gap-6 pt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Created</span>
                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                <Calendar className="size-3.5 text-slate-400" />
                                <span className="text-sm">{format(new Date(review.createdAt), "PPP")}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                            <div className="flex items-center gap-2">
                                <Badge className={review.isDeleted ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}>
                                    {review.isDeleted ? "Deleted" : "Active"}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification</span>
                            <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                                <ShieldCheck className="size-3.5" />
                                {review.isVerified ? "Verified" : "Pending"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
