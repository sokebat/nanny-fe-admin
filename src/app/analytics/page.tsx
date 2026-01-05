"use client";

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
    const [locationsTab, setLocationsTab] = useState("today");
    const [revenueTab, setRevenueTab] = useState("yearly");
    const [purchaseTab, setPurchaseTab] = useState("today");

    // Map locations data
    const mapLocations = [
        { id: 1, lat: 35, lng: 25 },
        { id: 2, lat: 45, lng: 35 },
        { id: 3, lat: 42, lng: 45 },
        { id: 4, lat: 40, lng: 50 },
        { id: 5, lat: 48, lng: 55 },
        { id: 6, lat: 30, lng: 72 },
    ];

    // Revenue data
    const revenueData = [
        { month: "Jan", thisYear: 85, previousYear: 65, localAverage: 70 },
        { month: "Feb", thisYear: 82, previousYear: 62, localAverage: 68 },
        { month: "Mar", thisYear: 88, previousYear: 67, localAverage: 72 },
        { month: "Apr", thisYear: 85, previousYear: 64, localAverage: 69 },
        { month: "May", thisYear: 90, previousYear: 68, localAverage: 73 },
        { month: "Jun", thisYear: 87, previousYear: 66, localAverage: 71 },
        { month: "Jul", thisYear: 89, previousYear: 69, localAverage: 74 },
        { month: "Aug", thisYear: 92, previousYear: 70, localAverage: 75 },
        { month: "Sep", thisYear: 88, previousYear: 67, localAverage: 72 },
        { month: "Oct", thisYear: 91, previousYear: 71, localAverage: 76 },
        { month: "Nov", thisYear: 90, previousYear: 69, localAverage: 74 },
        { month: "Dec", thisYear: 93, previousYear: 72, localAverage: 77 },
    ];

    // Purchase history data
    const purchaseData = [
        { time: "10:00 am", courses: 2000, resources: 10000 },
        { time: "01:00 pm", courses: 3500, resources: 7500 },
        { time: "04:00 pm", courses: 13000, resources: 11000 },
        { time: "07:00 pm", courses: 800, resources: 3500 },
        { time: "10:00 pm", courses: 2500, resources: 15000 },
        { time: "01:00 am", courses: 4000, resources: 10500 },
        { time: "03:00 am", courses: 5000, resources: 10000 },
        { time: "05:00 am", courses: 5500, resources: 4500 },
        { time: "08:00 am", courses: 3500, resources: 11000 },
    ];

    return (
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-muted">
            {/* Page Title */}
            <div className="mb-8">
                <h2 className="text-[#333] text-4xl" style={{ fontFamily: 'Righteous, sans-serif' }}>
                    Analytics
                </h2>
                <p className="text-muted-foreground mt-2">Comprehensive overview of your platform's performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Locations */}
                <Card className="shadow-sm border-none bg-white">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle className="text-xl font-bold">Locations</CardTitle>
                            <CardDescription>Activity across different regions</CardDescription>
                        </div>
                        <Tabs value={locationsTab} onValueChange={setLocationsTab}>
                            <TabsList className="grid w-full grid-cols-3 h-9">
                                <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                                <TabsTrigger value="today" className="text-xs data-[state=active]:bg-[#f97d61] data-[state=active]:text-white">Today</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        {/* Map */}
                        <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden mt-4 ring-1 ring-slate-200">
                            {/* Simplified map background */}
                            <div className="absolute inset-0 opacity-20">
                                <svg viewBox="0 0 500 300" className="w-full h-full">
                                    <path
                                        d="M50,150 Q100,100 150,120 T250,130 Q300,140 350,120 T450,150"
                                        fill="#94a3b8"
                                        stroke="#64748b"
                                        strokeWidth="1"
                                    />
                                    <path
                                        d="M100,200 Q150,180 200,190 T300,200 Q350,210 400,200"
                                        fill="#94a3b8"
                                        stroke="#64748b"
                                        strokeWidth="1"
                                    />
                                </svg>
                            </div>

                            {/* Location pins */}
                            {mapLocations.map((location) => (
                                <div
                                    key={location.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-full transition-all hover:scale-125 cursor-pointer"
                                    style={{
                                        left: `${location.lng}%`,
                                        top: `${location.lat}%`,
                                    }}
                                >
                                    <MapPin className="w-6 h-6 text-[#1f344e] fill-[#1f344e] drop-shadow-md" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue */}
                <Card className="shadow-sm border-none bg-white">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle className="text-xl font-bold">Revenue</CardTitle>
                            <CardDescription>Earnings comparison over time</CardDescription>
                        </div>
                        <Tabs value={revenueTab} onValueChange={setRevenueTab}>
                            <TabsList className="grid w-full grid-cols-3 h-9">
                                <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                                <TabsTrigger value="yearly" className="text-xs data-[state=active]:bg-[#f97d61] data-[state=active]:text-white">Yearly</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {/* Line Chart */}
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
                                    <Line
                                        name="This Year"
                                        type="monotone"
                                        dataKey="thisYear"
                                        stroke="#1f344e"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#1f344e', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        name="Previous Year"
                                        type="monotone"
                                        dataKey="previousYear"
                                        stroke="#f97d61"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#f97d61', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        name="Local Average"
                                        type="monotone"
                                        dataKey="localAverage"
                                        stroke="#94a3b8"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Purchase History */}
            <Card className="shadow-sm border-none bg-white">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 space-y-2 sm:space-y-0">
                    <div>
                        <CardTitle className="text-xl font-bold">Purchase History</CardTitle>
                        <CardDescription>Distribution of sales between categories</CardDescription>
                    </div>
                    <Tabs value={purchaseTab} onValueChange={setPurchaseTab}>
                        <TabsList className="grid w-full grid-cols-3 h-9">
                            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                            <TabsTrigger value="today" className="text-xs data-[state=active]:bg-[#f97d61] data-[state=active]:text-white">Today</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>
                <CardContent>
                    {/* Bar Chart */}
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={purchaseData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
                                <Bar
                                    name="Courses"
                                    dataKey="courses"
                                    fill="#1f344e"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                                <Bar
                                    name="Resources"
                                    dataKey="resources"
                                    fill="#f97d61"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};

export default Page;