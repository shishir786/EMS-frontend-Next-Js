"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { createNotice, deleteNotice, getAllNotices, updateNotice } from '../../lib/api'
import { useAuth } from '../../lib/auth-context'

import RequireAuth from '@/components/RequireAuth'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDashboardLink } from '@/lib/utils'
import Link from 'next/link'

const Notice = () => {
  const { token, user } = useAuth();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateToast, setShowCreateToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const fetchNotices = () => {
    if (!token) return;
    setLoading(true);
    getAllNotices(token)
      .then(data => setNotices(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load notices'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateNotice(editingId, form, token!);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
      } else {
        await createNotice(form, token!);
        setShowCreateToast(true);
        setTimeout(() => setShowCreateToast(false), 3000);
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      fetchNotices();
    } catch {
      setError('Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notice: any) => {
    setForm({ title: notice.title, content: notice.content });
    setEditingId(notice.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this notice?')) return;
    setSubmitting(true);
    try {
      await deleteNotice(id, token!);
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3000);
      fetchNotices();
    } catch {
      setError('Failed to delete notice');
    } finally {
      setSubmitting(false);
    }
  };

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
              <Link href="/notices">Notices</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>



      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Notices</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Create Notice Form */}
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl shadow flex flex-col gap-4 w-full md:w-1/2 max-w-md">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="border rounded px-3 py-2 text-base"
              disabled={submitting}
              required
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              className="border rounded px-3 py-2 text-base min-h-[80px]"
              disabled={submitting}
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={submitting}>
                {editingId ? 'Update' : 'Create'} Notice
              </button>
              {editingId && (
                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setEditingId(null); setForm({ title: '', content: '' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          {/* Notices List */}
          <div className="flex-1 max-h-[300px] overflow-y-auto">
            {loading ? (
              <LoadingSpinner text="Loading notices..." />
            ) : error ? (
              <div className="text-red-600 mb-4">{error}</div>
            ) : notices.length === 0 ? (
              <div className="text-muted-foreground">No notices yet.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {notices.map(notice => (
                  <Card key={notice.id} className="bg-card/80">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">{notice.title}</CardTitle>
                        <div className="text-xs text-muted-foreground">{new Date(notice.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:underline" onClick={() => handleEdit(notice)} disabled={submitting}>Edit</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(notice.id)} disabled={submitting}>Delete</button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-base text-foreground whitespace-pre-line">{notice.content}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showCreateToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span>Notice created successfully!</span>
          </div>
        </div>
      )}

      {showUpdateToast && (
        <div className="toast toast-end">
          <div className="alert alert-info">
            <span>Notice updated successfully!</span>
          </div>
        </div>
      )}

      {showDeleteToast && (
        <div className="toast toast-end">
          <div className="alert alert-warning">
            <span>Notice deleted successfully!</span>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}

export default Notice
