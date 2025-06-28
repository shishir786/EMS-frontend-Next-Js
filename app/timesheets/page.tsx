"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDashboardLink } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import RequireAuth from "../../components/RequireAuth";
import { createTimesheet, deleteTimesheet, getAllTimesheets, getMyTimesheets, updateTimesheet, updateTimesheetStatus } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function TimesheetListPage() {
  const { token, user } = useAuth();
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "", description: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"my" | "all">("my");
  const [showExportForm, setShowExportForm] = useState(false);
  const [exportForm, setExportForm] = useState({ startDate: "", endDate: "" });
  const [exportLoading, setExportLoading] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showCreateToast, setShowCreateToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showStatusToast, setShowStatusToast] = useState(false);

  // Get user role
  const getUserRole = () => {
    let role = "";
    if (Array.isArray(user?.role)) {
      role = user.role[0]?.trim().toLowerCase() || "";
    } else if (typeof user?.role === "string") {
      role = user.role.trim().toLowerCase();
    }
    return role;
  };

  const userRole = getUserRole();
  const isAdminOrManager = userRole === "admin" || userRole === "manager";

  const fetchTimesheets = () => {
    if (!token) return;
    setLoading(true);
    const fetchFunction = viewMode === "all" ? getAllTimesheets : getMyTimesheets;
    fetchFunction(token)
      .then(setTimesheets)
      .catch(() => setError("Failed to load timesheets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimesheets();
  }, [token, viewMode]);

  // Debug authentication
  useEffect(() => {
    // console.log("Auth debug - Token:", !!token);
    // console.log("Auth debug - User:", user);
    // console.log("Auth debug - Loading:", loading);

    // Test if token works with a simple API call
    if (token) {
      import("../../lib/api").then(({ getProfile }) => {
        getProfile(token)
          .then((profile) => {
            // console.log("Token test - Profile loaded:", profile);
          })
          .catch((err) => {
            // console.error("Token test - Profile failed:", err);
          });
      });
    }
  }, [token, user, loading]);

  const handleViewModeChange = (mode: "my" | "all") => {
    setViewMode(mode);
  };

  const handleExport = async () => {
    if (!token || !exportForm.startDate || !exportForm.endDate) return;
    setExportLoading(true);
    try {
      // Create CSV data with all columns
      const headers = [
        'ID',
        'Employee ID',
        'Employee Name',
        'Date',
        'Start Time',
        'End Time',
        'Total Hours',
        'Description',
        'Status',
        'Created At',
        'Updated At'
      ];

      const csvData = timesheets.map((ts) => [
        ts.id || ts._id || '',
        ts.employee?.id || '',
        ts.employeeName || '',
        ts.date || '',
        ts.startTime || '',
        ts.endTime || '',
        ts.totalHours || '',
        ts.description || '',
        ts.status || '',
        ts.createdAt || '',
        ts.updatedAt || ''
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timesheets-${exportForm.startDate}-to-${exportForm.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportForm(false);
      setExportForm({ startDate: "", endDate: "" });
    } catch (err: any) {
      alert(err.message || "Failed to export timesheets");
    } finally {
      setExportLoading(false);
    }
  };

  // // Helper function to display timesheet values properly
  // const displayValue = (value: any, key: string) => {
  //   if (value === null || value === undefined) return "-";

  //   // Handle nested objects (like user/employee references)
  //   if (typeof value === "object" && value !== null) {
  //     // If it's a user object with name property
  //     if (value.name) return value.name;
  //     // If it's a user object with email property
  //     if (value.email) return value.email;
  //     // For other objects, try to find a meaningful property
  //     if (value.id) return value.id;
  //     if (value._id) return value._id;
  //     // Fallback to JSON string for debugging
  //     return JSON.stringify(value);
  //   }

  //   // Handle dates
  //   if (key.toLowerCase().includes('date') && value) {
  //     return new Date(value).toLocaleDateString();
  //   }

  //   // Handle times
  //   if (key.toLowerCase().includes('time') && value) {
  //     return value;
  //   }

  //   // Default string conversion
  //   return String(value);
  // };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = (ts: any) => {
    setEditId(ts.id || ts._id);
    setForm({
      date: ts.date || "",
      startTime: ts.startTime || "",
      endTime: ts.endTime || "",
      description: ts.description || "",
    });
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setFormError("No authentication token found. Please login again.");
      return;
    }
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      // console.log("Token exists:", !!token);
      // console.log("Form data:", form);
      if (editId) {
        await updateTimesheet(editId, form, token);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
      } else {
        await createTimesheet(form, token);
        setShowCreateToast(true);
        setTimeout(() => setShowCreateToast(false), 3000);
      }
      setForm({ date: "", startTime: "", endTime: "", description: "" });
      setShowForm(false);
      setEditId(null);
      fetchTimesheets();
    } catch (err: any) {
      // console.error("Timesheet error:", err);
      // console.error("Error response:", err.response?.data);
      setFormError(err.response?.data?.message || err.message || (editId ? "Failed to update timesheet" : "Failed to create timesheet"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ date: "", startTime: "", endTime: "", description: "" });
    setFormError("");
    setFormSuccess("");
  };

  const handleDelete = async () => {
    if (!token || !deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteTimesheet(deleteId, token);
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3000);
      setDeleteId(null);
      fetchTimesheets();
    } catch (err: any) {
      alert(err.message || "Failed to delete timesheet");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'pending' | 'completed') => {
    if (!token || !selectedTimesheet) return;
    setStatusLoading(true);
    try {
      await updateTimesheetStatus(selectedTimesheet.id || selectedTimesheet._id, status, token);
      setShowStatusToast(true);
      setTimeout(() => setShowStatusToast(false), 3000);
      setShowStatusDialog(false);
      setSelectedTimesheet(null);
      fetchTimesheets();
    } catch (err: any) {
      alert(err.message || "Failed to update timesheet status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleViewClick = (ts: any) => {
    setSelectedTimesheet(ts);
    setShowStatusDialog(true);
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
              <Link href="/timesheets">Timesheets</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div style={{ maxWidth: 1400, margin: "auto", padding: 32 }}>
        <h2 className="mb-4 text-xl font-semibold">Timesheet List</h2>

        <Button onClick={() => setShowForm((v) => !v)} className="mb-6" variant="default">
          {showForm ? "Close" : "Create Timesheet"}
        </Button>

        {/* Role-based button switching */}
        {isAdminOrManager && (
          <div className="mb-6 flex gap-2 justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "my" ? "default" : "outline"}
                onClick={() => handleViewModeChange("my")}
              >
                My Timesheet
              </Button>
              <Button
                variant={viewMode === "all" ? "default" : "outline"}
                onClick={() => handleViewModeChange("all")}
              >
                All Timesheets
              </Button>
            </div>
            {viewMode === "all" && (
              <Button
                variant="outline"
                onClick={() => setShowExportForm(!showExportForm)}
              >
                Export Timesheets
              </Button>
            )}
          </div>
        )}

        {/* Export Form */}
        {showExportForm && isAdminOrManager && (
          <div className="mb-6 flex flex-wrap gap-4 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Start Date</label>
              <Input
                type="date"
                value={exportForm.startDate}
                onChange={(e) => setExportForm({ ...exportForm, startDate: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">End Date</label>
              <Input
                type="date"
                value={exportForm.endDate}
                onChange={(e) => setExportForm({ ...exportForm, endDate: e.target.value })}
                required
              />
            </div>
            <Button
              onClick={handleExport}
              disabled={exportLoading || !exportForm.startDate || !exportForm.endDate}
              className="h-10 min-w-[120px]"
            >
              {exportLoading ? "Exporting..." : "Export"}
            </Button>
            <Button
              onClick={() => {
                setShowExportForm(false);
                setExportForm({ startDate: "", endDate: "" });
              }}
              className="h-10 min-w-[120px]"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Status Update Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Timesheet Status</DialogTitle>
              <DialogDescription>
                Update the status for this timesheet entry.
              </DialogDescription>
            </DialogHeader>
            {selectedTimesheet && (
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label>Employee</Label>
                  <Input value={selectedTimesheet.employeeName || ''} disabled />
                </div>
                <div className="grid gap-3">
                  <Label>Date</Label>
                  <Input value={selectedTimesheet.date || ''} disabled />
                </div>
                <div className="grid gap-3">
                  <Label>Current Status</Label>
                  <Input value={selectedTimesheet.status || ''} disabled />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => handleStatusUpdate('pending')}
                disabled={statusLoading || selectedTimesheet?.status === 'pending'}
                variant="default"
              >
                {statusLoading ? "Updating..." : "Set Pending"}
              </Button>
              <Button
                onClick={() => handleStatusUpdate('completed')}
                disabled={statusLoading || selectedTimesheet?.status === 'completed'}
                variant="default"
              >
                {statusLoading ? "Updating..." : "Set Completed"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-8 flex flex-wrap gap-4 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Date</label>
              <Input type="date" name="date" value={form.date} onChange={handleFormChange} required />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Start Time</label>
              <Input type="time" name="startTime" value={form.startTime} onChange={handleFormChange} required />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">End Time</label>
              <Input type="time" name="endTime" value={form.endTime} onChange={handleFormChange} required />
            </div>
            <div className="flex flex-col flex-1 min-w-[200px]">
              <label className="mb-1 font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} required className="h-10 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none" />
            </div>
            <Button type="submit" disabled={formLoading} className="h-10 min-w-[120px]">
              {formLoading ? (editId ? "Saving..." : "Saving...") : (editId ? "Update" : "Save")}
            </Button>
            <Button type="button" onClick={handleCancelForm} className="h-10 min-w-[120px]" variant="outline">Cancel</Button>
            {formError && <div style={{ color: "red", marginLeft: 16 }}>{formError}</div>}
          </form>
        )}
        {loading && <LoadingSpinner text="Loading timesheets..." />}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && timesheets.length === 0 && (
          <div>No timesheets found.</div>
        )}
        {!loading && !error && timesheets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border-b text-left">ID</th>
                  <th className="px-4 py-2 border-b text-left">Employee ID</th>
                  <th className="px-4 py-2 border-b text-left">Employee Name</th>
                  <th className="px-4 py-2 border-b text-left">Date</th>
                  <th className="px-4 py-2 border-b text-left">Start Time</th>
                  <th className="px-4 py-2 border-b text-left">End Time</th>
                  <th className="px-4 py-2 border-b text-left">Total Hours</th>
                  <th className="px-4 py-2 border-b text-left">Description</th>
                  <th className="px-4 py-2 border-b text-left">Status</th>
                  <th className="px-4 py-2 border-b text-left">Created At</th>
                  <th className="px-4 py-2 border-b text-left">Updated At</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets
                  .sort((a, b) => (a.id || a._id) - (b.id || b._id))
                  .map((ts) => (
                    <tr key={ts.id || ts._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-2 border-b">{ts.id || ts._id || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.employee?.id || ts.employeeId || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.employeeName || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.date || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.startTime || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.endTime || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.totalHours || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.description || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.status || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.createdAt || "-"}</td>
                      <td className="px-4 py-2 border-b">{ts.updatedAt || "-"}</td>
                      <td className="px-4 py-2 border-b">
                        <div className="flex flex-row gap-2">
                          {viewMode === "my" && (
                            <Button size="sm" variant="outline" onClick={() => handleViewClick(ts)}>View</Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(ts)}>Edit</Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" onClick={() => setDeleteId(ts.id || ts._id)}>Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your timesheet and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Continue"}</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {showCreateToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>Timesheet created successfully!</span>
          </div>
        </div>
      )}

      {showUpdateToast && (
        <div className="toast toast-end">
          <div className="alert alert-info">
            <span>Timesheet updated successfully!</span>
          </div>
        </div>
      )}

      {showDeleteToast && (
        <div className="toast toast-end">
          <div className="alert alert-warning">
            <span>Timesheet deleted successfully!</span>
          </div>
        </div>
      )}

      {showStatusToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>Timesheet status updated successfully!</span>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
