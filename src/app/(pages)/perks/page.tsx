"use client";

import { PerkItem, PerksList } from "@/components/perks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
    const perksData: PerkItem[] = [
        {
            id: 1,
            name: "Course Name",
            accessDays: 30,
            type: "course",
            includedBenefits: [
                "6 Active Jobs",
                "Highlights Job with Colors",
                "60 Days Resume Visibility",
                "Urgents & Featured Jobs",
                "Access & Saved 20 Candidates",
                "24/7 Critical Support",
            ],
            remainingBenefits: [
                "9 Resume Access",
                "21 Days resume visibility",
                "4 Active Jobs",
                "7 Days job post visibility",
            ],
        },
        {
            id: 2,
            name: "Course Name",
            accessDays: 60,
            type: "course",
            includedBenefits: [
                "6 Active Jobs",
                "Highlights Job with Colors",
                "60 Days Resume Visibility",
                "Urgents & Featured Jobs",
                "Access & Saved 20 Candidates",
                "24/7 Critical Support",
            ],
            remainingBenefits: [
                "9 Resume Access",
                "21 Days resume visibility",
                "4 Active Jobs",
                "7 Days job post visibility",
            ],
        },
        {
            id: 3,
            name: "Course Name",
            accessDays: 90,
            type: "course",
            includedBenefits: [
                "6 Active Jobs",
                "Highlights Job with Colors",
                "60 Days Resume Visibility",
                "Urgents & Featured Jobs",
                "Access & Saved 20 Candidates",
                "24/7 Critical Support",
            ],
            remainingBenefits: [
                "9 Resume Access",
                "21 Days resume visibility",
                "4 Active Jobs",
                "7 Days job post visibility",
            ],
        },
        {
            id: 4,
            name: "Resource Name",
            accessDays: 30,
            type: "resource",
            includedBenefits: [
                "6 Active Jobs",
                "Highlights Job with Colors",
                "60 Days Resume Visibility",
                "Urgents & Featured Jobs",
                "Access & Saved 20 Candidates",
                "24/7 Critical Support",
            ],
            remainingBenefits: [
                "9 Resume Access",
                "21 Days resume visibility",
                "4 Active Jobs",
                "7 Days job post visibility",
            ],
        },
        {
            id: 5,
            name: "Resource Name",
            accessDays: 60,
            type: "resource",
            includedBenefits: [
                "6 Active Jobs",
                "Highlights Job with Colors",
                "60 Days Resume Visibility",
                "Urgents & Featured Jobs",
                "Access & Saved 20 Candidates",
                "24/7 Critical Support",
            ],
            remainingBenefits: [
                "9 Resume Access",
                "21 Days resume visibility",
                "4 Active Jobs",
                "7 Days job post visibility",
            ],
        },
        {
            id: 6,
            name: "Resource Name",
            accessDays: 90,
            type: "resource",
            includedBenefits: [
                "6 Active Jobs",
                "Highlights Job with Colors",
                "60 Days Resume Visibility",
                "Urgents & Featured Jobs",
                "Access & Saved 20 Candidates",
                "24/7 Critical Support",
            ],
            remainingBenefits: [
                "9 Resume Access",
                "21 Days resume visibility",
                "4 Active Jobs",
                "7 Days job post visibility",
            ],
        },
    ];

    const handleEdit = (id: number) => {
        console.log("Edit perk:", id);
        // Add your edit logic here
    };

    const courses = perksData.filter((perk) => perk.type === "course");
    const resources = perksData.filter((perk) => perk.type === "resource");

    return (
        <main className="flex-1 p-8 overflow-auto bg-muted">
            <div className="mb-6">
                <h2 className="text-foreground text-4xl mb-6 font-bold">
                    Perks & Benefits
                </h2>

                <Tabs defaultValue="courses" className="w-full">
                    <TabsList>
                        <TabsTrigger value="courses">Courses</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses" className="mt-6">
                        <PerksList perks={courses} onEdit={handleEdit} />
                    </TabsContent>

                    <TabsContent value="resources" className="mt-6">
                        <PerksList perks={resources} onEdit={handleEdit} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
};

export default Page;