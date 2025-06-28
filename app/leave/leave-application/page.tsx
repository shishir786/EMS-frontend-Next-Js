"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import RequireAuth from "../../../components/RequireAuth";
import { approveLeave, getAllLeaves, rejectLeave } from "../../../lib/api";
import { useAuth } from "../../../lib/auth-context";
import { getDashboardLink } from "../../../lib/utils";

const LeaveApplication = () => {
  const { token, user } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [showApproveToast, setShowApproveToast] = useState(false);
  const [showRejectToast, setShowRejectToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaves = () => {
    if (!token) return;
    setLoading(true);
    getAllLeaves(token)
      .then(setLeaves)
      .catch(() => setError("Failed to load leave requests"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line
  }, [token]);

  // Filter leaves based on search term
  const filteredLeaves = leaves.filter((leave) => {
    if (!searchTerm) return true;
    const name = leave.user?.name || leave.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleApprove = async (id: string) => {
    if (!token) return;
    setActionLoading(id + "-approve");
    setActionError("");
    try {
      await approveLeave(id, token, "APPROVED");
      setShowApproveToast(true);
      setTimeout(() => setShowApproveToast(false), 3000);
      fetchLeaves();
    } catch (err: any) {
      setActionError(err.message || "Failed to approve leave");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    setActionLoading(id + "-reject");
    setActionError("");
    try {
      await rejectLeave(id, token);
      setShowRejectToast(true);
      setTimeout(() => setShowRejectToast(false), 3000);
      fetchLeaves();
    } catch (err: any) {
      setActionError(err.message || "Failed to reject leave");
    } finally {
      setActionLoading(null);
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
              <Link href="/leave/leave-aplication">leave-application</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto mt-10 max-w-5xl rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">All Leave Requests</h2>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading && <LoadingSpinner text="Loading leave requests..." />}
        {error && <div className="text-red-600 text-center font-medium mb-4">{error}</div>}
        {!loading && !error && filteredLeaves.length === 0 && (
          <div className="text-center">
            {searchTerm ? `No leave requests found for "${searchTerm}"` : "No leave requests found."}
          </div>
        )}
        {!loading && !error && filteredLeaves.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {Object.keys(leaves[0]).map((key) => (
                    <th key={key} className="px-4 py-2 border-b capitalize text-left">{key.replace(/_/g, " ")}</th>
                  ))}
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id || leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {Object.values(leave).map((value, idx) => (
                      <td key={`${leave.id || leave._id}-${idx}`} className="px-4 py-2 border-b">{String(value)}</td>
                    ))}
                    <td className="px-4 py-2 border-b">
                      {leave.status === "PENDING" ? (
                        <div className="flex flex-row gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(leave.id || leave._id)}
                            disabled={actionLoading === (leave.id || leave._id) + "-approve"}
                          >
                            {actionLoading === (leave.id || leave._id) + "-approve" ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(leave.id || leave._id)}
                            disabled={actionLoading === (leave.id || leave._id) + "-reject"}
                          >
                            {actionLoading === (leave.id || leave._id) + "-reject" ? "Rejecting..." : "Reject"}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-green-600 font-semibold">{leave.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {actionError && <div className="text-red-600 text-center font-medium mt-4">{actionError}</div>}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {showApproveToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>Leave request approved successfully!</span>
          </div>
        </div>
      )}

      {showRejectToast && (
        <div className="toast toast-end">
          <div className="alert alert-warning">
            <span>Leave request rejected successfully!</span>
          </div>
        </div>
      )}
    </RequireAuth>
  );
};

export default LeaveApplication;
