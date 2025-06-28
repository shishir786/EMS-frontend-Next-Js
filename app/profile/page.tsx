"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getDashboardLink } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import RequireAuth from "../../components/RequireAuth";
import { getProfileAxios } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function DashboardPage() {
  const { token, user } = useAuth();
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
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1">
                <BreadcrumbEllipsis className="size-4" />
                <span className="sr-only">Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Login</DropdownMenuItem>
                {/* <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={getDashboardLink(user)}>
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="profile">Profile</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
        {loading && <LoadingSpinner text="Loading profile..." />}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {profile && (
          <div className="mx-auto mt-6 max-w-2xl">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {profile.name ? String(profile.name).charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{String(profile.name || 'User')}</h1>
                  <p className="text-blue-100 text-lg">{String(profile.email || 'user@example.com')}</p>
                  <p className="text-blue-100 text-sm mt-1">
                    {profile.role ? `Role: ${String(profile.role).toUpperCase()}` : 'Employee'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                <span className="mr-2">👤</span>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(profile).map(([key, value]) => {
                  // Skip name and email as they're already in the header
                  if (key === 'name' || key === 'email') return null;

                  const getIcon = (key: string) => {
                    switch (key.toLowerCase()) {
                      case 'role': return '🎭';
                      case 'phone': return '📞';
                      case 'address': return '📍';
                      case 'department': return '🏢';
                      case 'position': return '💼';
                      case 'employee_id': return '🆔';
                      case 'id': return '🆔';
                      case 'created_at': return '📅';
                      case 'updated_at': return '🔄';
                      default: return '📋';
                    }
                  };

                  const formatValue = (key: string, value: any) => {
                    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
                      return new Date(value).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    }
                    return String(value);
                  };

                  return (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getIcon(key)}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                            {key.replace(/_/g, " ")}
                          </h3>
                          <p className="text-gray-900 dark:text-white font-medium mt-1">
                            {formatValue(key, value)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
