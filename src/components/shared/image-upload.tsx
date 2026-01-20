import { Upload as UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    onUpload?: (file: File) => void;
    className?: string;
    id?: string;
}

export function ImageUpload({ onUpload, className, id }: ImageUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            onUpload(file);
        }
    };

    return (
        <div className={cn("w-full", className)}>
            <label className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all duration-200 border-border hover:border-primary/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <div className="mb-3 p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                        <UploadIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-foreground mb-1">
                        <span className="font-semibold text-primary">Browse photo</span> or drag here
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                        A photo larger than 400 pixels work best. Max photo size 5 MB.
                    </p>
                </div>
                <input
                    id={id}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}
