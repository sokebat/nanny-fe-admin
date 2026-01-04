"use client";

import { useState } from "react";
import { CoursesTable, CourseItem } from "@/components/courses";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
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

const ManageCourse = () => {
    const [open, setOpen] = useState(false);

    const coursesData: CourseItem[] = [
        {
            id: 1,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "United States",
            price: "$119/Year",
            status: "Uploaded",
        },
        {
            id: 2,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Canada",
            price: "$11.9/Month",
            status: "Uploaded",
        },
        {
            id: 3,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Pending",
        },
        {
            id: 4,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Uploaded",
        },
        {
            id: 5,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Uploaded",
        },
        {
            id: 6,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Pending",
        },
        {
            id: 7,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Uploaded",
        },
        {
            id: 8,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Uploaded",
        },
        {
            id: 9,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Uploaded",
        },
        {
            id: 10,
            name: "Course Name",
            detail: "Course detail is written here",
            location: "Corner street 46 London",
            price: "$119/Year",
            status: "Uploaded",
        },
    ];

    const handleUpload = (file: File) => {
        console.log("Uploaded file:", file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Course submitted");
        setOpen(false);
    };

    return (
        <main className="flex-1 p-8 overflow-auto bg-muted">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-foreground text-4xl font-bold">Manage Courses</h2>

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button className="bg-brand-navy hover:bg-[#2d4a6a] text-white px-8 py-2.5 h-auto">
                                Upload
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                            <SheetHeader className="pb-6 border-b">
                                <SheetTitle className="text-2xl font-bold">Upload Course</SheetTitle>
                                <SheetDescription className="text-sm">Basic Information</SheetDescription>
                            </SheetHeader>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-8 px-1">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-semibold">Profile Picture</Label>
                                        <ImageUpload onUpload={handleUpload} className="mt-3" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="courseName" className="text-sm font-medium">
                                                Name of Course
                                            </Label>
                                            <Input
                                                id="courseName"
                                                placeholder="Enter course name"
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="totalSales" className="text-sm font-medium">
                                                Total Sales
                                            </Label>
                                            <Input
                                                id="totalSales"
                                                placeholder="Enter total sales"
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="startDate" className="text-sm font-medium">
                                                Starting date
                                            </Label>
                                            <Input id="startDate" type="date" className="mt-2" />
                                        </div>
                                        <div>
                                            <Label htmlFor="endDate" className="text-sm font-medium">
                                                Ending date
                                            </Label>
                                            <Input id="endDate" type="date" className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="accessDays" className="text-sm font-medium">
                                                No. of Access Days
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="mt-2 w-full">
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="30">30 Days</SelectItem>
                                                    <SelectItem value="60">60 Days</SelectItem>
                                                    <SelectItem value="90">90 Days</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="duration" className="text-sm font-medium">
                                                Duration
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="mt-2 w-full">
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1week">1 Week</SelectItem>
                                                    <SelectItem value="2weeks">2 Weeks</SelectItem>
                                                    <SelectItem value="1month">1 Month</SelectItem>
                                                    <SelectItem value="3months">3 Months</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="lessons" className="text-sm font-medium">
                                                No. of Lessons
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="mt-2 w-full">
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">5 Lessons</SelectItem>
                                                    <SelectItem value="10">10 Lessons</SelectItem>
                                                    <SelectItem value="15">15 Lessons</SelectItem>
                                                    <SelectItem value="20">20 Lessons</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="price" className="text-sm font-medium">
                                                Price
                                            </Label>
                                            <Input
                                                id="price"
                                                placeholder="Enter price"
                                                type="number"
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description" className="text-sm font-semibold">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Write details of your course..."
                                            className="mt-3 min-h-[120px]"
                                        />
                                    </div>
                                </div>

                                <div className="py-8 border-t">
                                    <Button
                                        type="submit"
                                        className="w-full bg-brand-navy hover:bg-[#2d4a6a] text-white h-11"
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>

                <CoursesTable courses={coursesData} />
            </div>
        </main>
    );
};

export default ManageCourse;