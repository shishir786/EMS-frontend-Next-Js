"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { getProfileAxios } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function ManagerDashboardPage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getProfileAxios(token)
      .then(setProfile)
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
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
              <Link href="login">login</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="manager-dashboard">manager-dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Link href="change-pass"> <button className="btn btn-soft btn-info w-50 h-10 rounded-4xl m-5 ">Chnage Password</button> </Link>
      <Link href="profile"><button className="btn btn-soft btn-info w-50 h-10 rounded-4xl m-5">Profile Info</button></Link>
      <Link href="edit-profile"><button className="btn btn-soft btn-info w-50 h-10 rounded-4xl m-5">Edit Profile</button></Link>
      <Link href="timesheets"><button className="btn btn-soft btn-info w-50 h-10 rounded-4xl m-5">Time Sheet</button></Link>
      <Link href="leave-apply"><button className="btn btn-soft btn-info w-50 h-10 rounded-4xl m-5">Leave Apply</button></Link>

      <h2>Dashboard</h2>
      {loading && <div>Loading profile...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {profile && (
        <div className="mx-auto mt-6 max-w-md rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold">Profile Info</h3>
          <ul className="space-y-2">
            {Object.entries(profile).map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="font-medium capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-gray-700 dark:text-gray-200">
                  {String(value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </RequireAuth>
  );
}
