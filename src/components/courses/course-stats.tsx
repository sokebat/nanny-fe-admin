import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, BookOpen, Users, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import type { CourseStats as CourseStatsType } from "@/types/course";

interface CourseStatsProps {
    stats: CourseStatsType;
}

export function CourseStats({ stats }: CourseStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
            {/* Course Statistics */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-1 pt-2 px-2.5">
                    <CardTitle className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        Total Courses
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2 pt-0">
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {stats.courses.total}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
                <CardHeader className="pb-1 pt-2 px-2.5">
                    <CardTitle className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="w-3 h-3 text-green-600 dark:text-green-400" />
                        Listed
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2 pt-0">
                    <div className="text-xl font-bold text-green-700 dark:text-green-300">
                        {stats.courses.listed}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-1 pt-2 px-2.5">
                    <CardTitle className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        Popular
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2 pt-0">
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        {stats.courses.popular}
                    </div>
                </CardContent>
            </Card>

            {/* Enrollment Statistics */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-1 pt-2 px-2.5">
                    <CardTitle className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        Total Enrollments
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2 pt-0">
                    <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
                        {stats.enrollments.total}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/20 dark:to-cyan-900/10 border-cyan-200 dark:border-cyan-800">
                <CardHeader className="pb-1 pt-2 px-2.5">
                    <CardTitle className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        Active
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2 pt-0">
                    <div className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
                        {stats.enrollments.active}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-1 pt-2 px-2.5">
                    <CardTitle className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Completed
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2 pt-0">
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {stats.enrollments.completed}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

