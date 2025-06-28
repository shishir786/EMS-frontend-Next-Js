"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RequireAuth from "@/components/RequireAuth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { deleteUser, getAllUsers, updateUserRole } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getDashboardLink } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from 'react';
import LoadingSpinner from "../../components/LoadingSpinner";

const Users = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleDialogId, setRoleDialogId] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [toasts, setToasts] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'warning' }[]>([]);
  const [search, setSearch] = useState("");

  // Only allow admin or manager
  const role = Array.isArray(user?.role)
    ? user.role[0]?.trim().toLowerCase()
    : typeof user?.role === 'string'
      ? user.role.trim().toLowerCase()
      : '';
  const isAllowed = role === 'admin' || role === 'manager';

  useEffect(() => {
    if (!token || !isAllowed) return;
    setLoading(true);
    getAllUsers(token)
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [token, isAllowed]);

  const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setToasts((prev) => [...prev, { message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2000);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setDeleteLoading(true);
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      setDeletingId(null);
      showToast('User deleted successfully.', 'success');
    } catch (err) {
      showToast('Failed to delete user.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenRoleDialog = (user: any) => {
    setRoleDialogId(user.id || user._id);
    const roleValue = Array.isArray(user.role) ? user.role[0] : user.role;
    setSelectedRole(roleValue);
  };

  const handleUpdateRole = async (id: string) => {
    if (!token) return;
    setRoleLoading(true);
    try {
      await updateUserRole(id, [selectedRole], token);
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u._id) === id ? { ...u, role: [selectedRole] } : u
        )
      );
      setRoleDialogId(null);
      showToast('Role updated successfully.', 'success');
    } catch (err) {
      showToast('Failed to update role.', 'error');
    } finally {
      setRoleLoading(false);
    }
  };

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xl font-semibold text-red-600">
        <div className="flex w-52 flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-28"></div>
            </div>
          </div>
          <div className="skeleton h-32 w-full"></div>
        </div>

      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
              <Link href="/users">all-user</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-3xl mx-auto pt-10 pb-5">
        <h2 className="font-bold text-4xl mb-4">All Users</h2>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableCaption>A list of all users in the system.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {role === 'admin' && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
                .slice()
                .sort((a, b) => (a.id || a._id) - (b.id || b._id))
                .map((user) => (
                  <TableRow key={user.id || user._id}>
                    <TableCell className="font-medium">{user.id || user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    {role === 'admin' && (
                      <TableCell>
                        <AlertDialog
                          open={deletingId === (user.id || user._id)}
                          onOpenChange={(open: boolean) => setDeletingId(open ? (user.id || user._id) : null)}
                        >
                          <AlertDialogTrigger asChild>
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this user? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel asChild>
                                <button className="px-3 py-1 rounded border">Cancel</button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <button
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                  onClick={() => handleDelete(user.id || user._id)}
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? 'Deleting...' : 'Delete'}
                                </button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Dialog open={roleDialogId === (user.id || user._id)} onOpenChange={(open) => setRoleDialogId(open ? (user.id || user._id) : null)}>
                          <DialogTrigger asChild>
                            <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Change Role</button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change User Role</DialogTitle>
                              <DialogDescription>
                                Select a role for this user.
                              </DialogDescription>
                            </DialogHeader>
                            <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                              {['user', 'manager', 'admin'].map((r) => (
                                <div key={r} className="flex items-center gap-3">
                                  <RadioGroupItem value={r} id={`role-${r}`} />
                                  <Label htmlFor={`role-${r}`}>{r.charAt(0).toUpperCase() + r.slice(1)}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                            <DialogFooter>
                              <DialogClose asChild>
                                <button className="px-3 py-1 rounded border">Cancel</button>
                              </DialogClose>
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                onClick={() => handleUpdateRole(user.id || user._id)}
                                disabled={roleLoading || !selectedRole}
                              >
                                {roleLoading ? 'Saving...' : 'Save Changes'}
                              </button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {toasts.length > 0 && (
        <div className="toast toast-end z-50 fixed">
          {toasts.map((toast, idx) => (
            <div key={idx} className={`alert alert-${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}

    </RequireAuth>
  )
}

export default Users
