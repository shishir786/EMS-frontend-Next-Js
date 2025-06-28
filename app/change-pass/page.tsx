"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  // BreadcrumbEllipsis,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { changePassword } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { getDashboardLink } from "@/lib/utils";
import Link from "next/link";

export default function ChangePasswordPage() {
  const { user, token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (!token) throw new Error("Not authenticated");
      await changePassword({ currentPassword, newPassword }, token);
      setShowToast(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>

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
              <Link href={getDashboardLink(user)}>
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/change-pass">Password-Change</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <div style={{ maxWidth: 700, margin: "auto", padding: 32 }}>
        <div className="max-w-xl mx-auto">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Change Password</h1>
            <p className="text-blue-100 text-sm">Update your account password to keep it secure</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="mr-2">🔒</span>
                  Current Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="mr-2">🆕</span>
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Changing Password...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✅</span>
                    Change Password
                  </>
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>Password changed successfully!</span>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
