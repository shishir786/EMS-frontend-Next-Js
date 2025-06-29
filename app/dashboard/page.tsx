"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import RequireAuth from "../../components/RequireAuth";
import { getAllNotices, getLeaves, getMyTimesheets, getProfileAxios } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { getDashboardLink } from "@/lib/utils";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [timesheetCount, setTimesheetCount] = useState(0);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [notices, setNotices] = useState<any[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      getProfileAxios(token),
      getLeaves(token),
      getMyTimesheets(token),
    ])
      .then(([profile, leaves, timesheets]) => {
        setProfile(profile);
        setUserCount(1);
        setLeaveCount(leaves.length);
        setTimesheetCount(timesheets.length);
      })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setNoticesLoading(true);
    getAllNotices(token)
      .then((data) => {
        setNotices(Array.isArray(data) ? data : []);
        setNoticesError("");
      })
      .catch(() => setNoticesError("Failed to load notices"))
      .finally(() => setNoticesLoading(false));
  }, [token]);

  return (
    <RequireAuth>
      {/* breadcrumb */}
      <Breadcrumb className="ml-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/login">login</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={getDashboardLink(user)}>
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="mb-8 text-muted-foreground">
          `Welcome{profile?.name ? `, ${profile.name}` : ""}! Here's an overview of your team and quick links.
</p>
        {loading ? (
          <LoadingSpinner text="Loading dashboard..." />
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <>
            {/* Stat Cards + Calendar */}
            <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start">
              {/* Left column: stat cards + notices */}
              <div className="flex flex-col gap-6 w-full lg:w-3/4 xl:w-2/3 min-h-[420px]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Card className="border-blue-500">
                    <CardHeader>
                      <CardTitle>
                        <span className="text-blue-500 mr-2">👤</span>Profile
                      </CardTitle>
                      <CardDescription>Your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-center">{userCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-500">
                    <CardHeader>
                      <CardTitle>
                        <span className="text-green-500 mr-2">🌿</span>Leaves
                      </CardTitle>
                      <CardDescription>Your leave applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-center">{leaveCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-500">
                    <CardHeader>
                      <CardTitle>
                        <span className="text-yellow-500 mr-2">🕒</span>Timesheets
                      </CardTitle>
                      <CardDescription>Your timesheets submitted</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-center">{timesheetCount}</div>
                    </CardContent>
                  </Card>
                </div>
                {/* Notices Card (API connected) */}
                <Card className="border-blue-500 bg-blue-50/10 shadow-lg flex-1 min-h-[180px] max-h-[250px]">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500 text-xl">📢</span>
                      <CardTitle className="text-lg font-semibold">Notices</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-y-auto max-h-[170px] pr-2">
                    {noticesLoading ? (
                      <div className="flex flex-col gap-2">
                        <div className="h-6 bg-accent animate-pulse rounded w-1/2 mb-2" />
                        <div className="h-4 bg-accent animate-pulse rounded w-3/4" />
                        <div className="h-4 bg-accent animate-pulse rounded w-2/3" />
                      </div>
                    ) : noticesError ? (
                      <div className="text-red-600 text-sm">{noticesError}</div>
                    ) : notices.length > 0 ? (
                      <>
                        {/* Latest notice prominently */}
                        <div className="mb-2 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500 text-lg">🆕</span>
                            <span className="font-semibold text-base truncate">{notices[0].title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">{new Date(notices[0].createdAt).toLocaleString()}</div>
                          <div className="text-foreground text-sm mb-1 line-clamp-2">{notices[0].content}</div>
                        </div>
                        {/* Other notices */}
                        {notices.slice(1).map((notice) => (
                          <div key={notice.id} className="border-t border-muted pt-1 mt-1 py-1">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-400">📄</span>
                              <span className="font-medium text-sm truncate">{notice.title}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-0.5">{new Date(notice.createdAt).toLocaleString()}</div>
                            <div className="text-foreground text-xs line-clamp-2">{notice.content}</div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-base text-foreground">No notices yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* Right column: calendar */}
              <div className="flex-shrink-0 w-full lg:w-[350px] min-h-[430px]">
                <Card className="h-full flex flex-col items-center justify-center bg-card rounded-xl p-0 border-none min-w-[280px] min-h-[430px]">
                  <CardHeader className="flex flex-row items-center justify-center gap-2 pt-6 pb-2">
                    <span className="text-purple-500 text-xl">📅</span>
                    <CardTitle className="text-foreground text-lg font-semibold">Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-0 pb-6">
                    <div className="w-[280px] md:w-[300px]">
                      <Calendar
                        mode="single"
                        selected={calendarDate}
                        onSelect={setCalendarDate}
                        className="rounded-lg w-full bg-card text-foreground"
                        captionLayout="dropdown"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Link href="/change-pass">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2">🔑</span>Change Password
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/profile">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2">👤</span>Profile Info
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/edit-profile">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2">✏️</span>Edit Profile
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/timesheets">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2">🕒</span>Time Sheet
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/leave/leave-apply">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2">📝</span>Leave Apply
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/leave/leave-history">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      <span className="mr-2">📄</span>Leave History
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </>
        )}
      </div>
    </RequireAuth>
  );
}
