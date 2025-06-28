"use client"

import RequireAuth from "@/components/RequireAuth";
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
import { createLeave } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getDashboardLink } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from 'react';
const LeaveApply = () => {
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!token) throw new Error('Not authenticated');
      await createLeave(form, token);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setForm({ type: '', startDate: '', endDate: '', reason: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to apply for leave');
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
              <Link href="/leave/leave-apply">leave-apply</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white dark:bg-gray-800 p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="leave-type">Leave Type</label>
            <select
              id="leave-type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select type</option>
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="EARNED">Earned</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="start-date">Start Date</label>
            <Input type="date" id="start-date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="end-date">End Date</label>
            <Input type="date" id="end-date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="reason">Reason</label>
            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[48px]"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-11 text-base font-semibold">
            {loading ? 'Submitting...' : 'Apply'}
          </Button>
          {error && <div className="text-red-600 text-center font-medium">{error}</div>}
          {showToast && (
            <div className="toast toast-end">
              <div className="alert alert-success">
                <span>Leave application submitted successfully!</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </RequireAuth>
  );
}

export default LeaveApply
