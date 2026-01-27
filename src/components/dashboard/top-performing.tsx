"use client";

import { useDashboardOverview } from "@/hooks/use-admin-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ExternalLink, Video, FileText } from "lucide-react";

export default function TopPerforming() {
    const { data: overview, isLoading } = useDashboardOverview();

    if (isLoading || !overview) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading top performing data...</div>;
    }

    return (
        <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Top Performing Content</h3>
            <Tabs defaultValue="courses">
                <TabsList className="mb-4">
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="courses">
                    <div className="space-y-4">
                        {overview.topPerforming.courses.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No courses found.</div>
                        ) : (
                            overview.topPerforming.courses.map((course: any) => (
                                <div key={course._id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Video className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {course.enrollmentCount} Enrollments • ${course.price}
                                            </p>
                                        </div>
                                    </div>
                                    {course.videoUrl && (
                                        <Link href={course.videoUrl} target="_blank" className="text-muted-foreground hover:text-primary">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="resources">
                    <div className="space-y-4">
                        {overview.topPerforming.resources.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No resources found.</div>
                        ) : (
                            overview.topPerforming.resources.map((resource: any) => (
                                <div key={resource._id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center text-green-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{resource.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {resource.viewCount} Views • {resource.type?.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    {resource.fileUrl && (
                                        <Link href={resource.fileUrl} target="_blank" className="text-muted-foreground hover:text-primary">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
