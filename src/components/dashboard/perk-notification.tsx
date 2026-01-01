"use client";
import { X } from "lucide-react";

interface PerkNotificationProps {
    onClose: () => void;
}

export default function PerkNotification({ onClose }: PerkNotificationProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-4 max-w-md relative">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold">
                    P
                </div>
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm mb-1">Perk Activation Request</p>
                <p className="text-xs text-gray-600">Complete your profile now.</p>
            </div>
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
