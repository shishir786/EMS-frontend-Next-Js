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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { createTimesheet, deleteTimesheet, getMyTimesheets, updateTimesheet } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function TimesheetListPage() {
  const { token } = useAuth();
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

  const fetchTimesheets = () => {
    if (!token) return;
    setLoading(true);
    getMyTimesheets(token)
      .then(setTimesheets)
      .catch(() => setError("Failed to load timesheets"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimesheets();
  }, [token]);

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
    if (!token) return;
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      if (editId) {
        await updateTimesheet(editId, form, token);
        setFormSuccess("Timesheet updated successfully.");
      } else {
        await createTimesheet(form, token);
        setFormSuccess("Timesheet created successfully.");
      }
      setForm({ date: "", startTime: "", endTime: "", description: "" });
      setShowForm(false);
      setEditId(null);
      fetchTimesheets();
    } catch (err: any) {
      setFormError(err.message || (editId ? "Failed to update timesheet" : "Failed to create timesheet"));
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
      setDeleteId(null);
      fetchTimesheets();
    } catch (err: any) {
      alert(err.message || "Failed to delete timesheet");
    } finally {
      setDeleteLoading(false);
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
              <Link href="/dashboard">Dashboard</Link>
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
            {formSuccess && <div style={{ color: "green", marginLeft: 16 }}>{formSuccess}</div>}
          </form>
        )}
        {loading && <div>Loading timesheets...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && timesheets.length === 0 && (
          <div>No timesheets found.</div>
        )}
        {!loading && !error && timesheets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {Object.keys(timesheets[0]).map((key) => (
                    <th key={key} className="px-4 py-2 border-b capitalize text-left">{key.replace(/_/g, " ")}</th>
                  ))}
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((ts) => (
                  <tr key={ts.id || ts._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {Object.values(ts).map((value, idx) => (
                      <td key={idx} className="px-4 py-2 border-b">{String(value)}</td>
                    ))}
                    <td className="px-4 py-2 border-b">
                      <div className="flex flex-row gap-2">
                        <Button size="sm" variant="outline">View</Button>
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
    </RequireAuth>
  );
}
