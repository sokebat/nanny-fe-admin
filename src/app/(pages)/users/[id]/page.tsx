"use client";

import { useAdminUser, useAdminUserSubscriptions, useAdminUserInvoices, useAdminUserCourses, useAdminUserJobs } from "@/hooks/use-admin-users";
import { Loader2, ArrowLeft, Mail, Phone, Calendar, MapPin, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminUser, AdminUserSubscription, AdminUserInvoice, AdminUserCourse, UserJob } from "@/types/admin-users";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: user, isLoading: isLoadingUser } = useAdminUser(id);

    if (isLoadingUser) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">User not found</p>
                <Link href="/users" className="text-primary hover:underline">
                    Back to Users
                </Link>
            </div>
        );
    }

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted/20">
            <div className="mb-6">
                <Link href="/users" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{user.firstName} {user.lastName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                {user.role}
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {user.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <div className="flex flex-col items-center mb-6">
                            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground mb-4 overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover" />
                                ) : (
                                    <UserIcon className="h-12 w-12" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user.phone || "No phone number"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined {format(new Date(user.createdAt), "PP")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="lg:col-span-2">
                    <div className="bg-card border rounded-lg p-6 shadow-sm min-h-[500px]">
                        <Tabs defaultValue="subscriptions">
                            <TabsList className="grid w-full grid-cols-4 mb-6">
                                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                                <TabsTrigger value="courses">Courses</TabsTrigger>
                                <TabsTrigger value="jobs">{user.role === 'caregiver' ? 'Applications' : 'Jobs'}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="subscriptions">
                                <SubscriptionsTab userId={user._id} />
                            </TabsContent>
                            <TabsContent value="invoices">
                                <InvoicesTab userId={user._id} />
                            </TabsContent>
                            <TabsContent value="courses">
                                <CoursesTab userId={user._id} />
                            </TabsContent>
                            <TabsContent value="jobs">
                                <JobsTab userId={user._id} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </main>
    );
}

function SubscriptionsTab({ userId }: { userId: string }) {
    const { data: subscriptions, isLoading } = useAdminUserSubscriptions(userId);

    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />;

    if (!subscriptions || subscriptions.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No subscriptions found.</div>;
    }

    return (
        <div className="space-y-4">
            {subscriptions.map((sub) => (
                <div key={sub._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <p className="font-medium">{sub.planName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{sub.interval}ly</p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">${sub.amount}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {sub.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function InvoicesTab({ userId }: { userId: string }) {
    const { data, isLoading } = useAdminUserInvoices(userId);
    const invoices = data?.docs || [];

    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />;

    if (invoices.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No invoices found.</div>;
    }

    return (
        <div className="space-y-2">
            {invoices.map((invoice) => (
                <div key={invoice._id} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{format(new Date(invoice.date), "PP")}</span>
                        <span className="text-xs text-muted-foreground">ID: {invoice._id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">${invoice.amount}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CoursesTab({ userId }: { userId: string }) {
    const { data, isLoading } = useAdminUserCourses(userId);
    const courses = data?.docs || [];

    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />;

    if (courses.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No courses enrolled.</div>;
    }

    return (
        <div className="space-y-4">
            {courses.map((course) => (
                <div key={course._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${course.status === 'completed' ? 'bg-green-100 text-green-700' :
                            course.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {course.status}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground">{course.progress}% Complete</p>
                </div>
            ))}
        </div>
    );
}

function JobsTab({ userId }: { userId: string }) {
    const { data, isLoading } = useAdminUserJobs(userId);
    const jobs = data?.docs || [];

    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />;

    if (jobs.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No jobs found.</div>;
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div key={job._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{job.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${job.status === 'open' ? 'bg-green-100 text-green-700' :
                            job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {job.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Posted: {format(new Date(job.createdAt), "PP")}</p>
                </div>
            ))}
        </div>
    );
}
