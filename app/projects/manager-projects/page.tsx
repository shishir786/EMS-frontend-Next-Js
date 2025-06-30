"use client"

import LoadingSpinner from '@/components/LoadingSpinner';
import RequireAuth from '@/components/RequireAuth';
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
} from '@/components/ui/alert-dialog';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getAllUsers,
  updateProject,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getDashboardLink } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from 'react';

interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string | string[];
}

interface Project {
  id: string | number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  assignedEmployees: User[];
  assignedUsers?: User[];
  createdAt?: string;
  updatedAt?: string;
  creator?: User;
}

const emptyProject: Project = {
  id: '',
  name: '',
  description: '',
  status: '',
  startDate: '',
  endDate: '',
  assignedEmployees: [],
};

const PROJECT_STATUSES = ['Planned', 'Active', 'Completed'];

// Utility function to format date as YYYY-MM-DD
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

const ManagerProject = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<typeof emptyProject>(emptyProject);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCreateToast, setShowCreateToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAllProjects(token);
      setProjects(data);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (e) {
      // handle error
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setCurrentProject(emptyProject);
    setSelectedEmployeeIds([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditMode(true);
    setCurrentProject({
      ...project,
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    });
    setSelectedEmployeeIds(project.assignedEmployees?.map((u) => String(u.id)) || []);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentProject(emptyProject);
    setSelectedEmployeeIds([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentProject({ ...currentProject, [e.target.name]: e.target.value });
  };

  const handleEmployeeToggle = (id: string | number) => {
    const idStr = String(id);
    setSelectedEmployeeIds((prev) =>
      prev.includes(idStr) ? prev.filter((eid) => eid !== idStr) : [...prev, idStr]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const payload: any = {
        name: currentProject.name,
        description: currentProject.description,
        startDate: currentProject.startDate,
        endDate: currentProject.endDate,
        assignedEmployees: selectedEmployeeIds,
      };
      if (editMode) {
        payload.status = currentProject.status;
      }
      console.log('Submitting project payload:', payload);
      if (editMode) {
        await updateProject(String(currentProject.id), payload, token);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 2000);
      } else {
        await createProject(payload, token);
        setShowCreateToast(true);
        setTimeout(() => setShowCreateToast(false), 2000);
      }
      fetchProjects();
      setDialogOpen(false);
    } catch (e) {
      // handle error
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteId) return;
    try {
      await deleteProject(deleteId, token);
      fetchProjects();
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 2000);
      setDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (e) {
      // handle error
    }
  };

  return (
    <RequireAuth>
      <Breadcrumb className="ml-5 mb-6">
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
              <Link href="/projects/manager-projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={handleOpenCreate} className="mt-2">Add Project</Button>
        </div>
        <div className="max-h-[420px] overflow-y-auto rounded-lg border min-h-[120px] flex items-center justify-center">
          {loading ? (
            <LoadingSpinner text="Loading projects..." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Assigned Employees</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{formatDate(project.startDate)}</TableCell>
                    <TableCell>{formatDate(project.endDate)}</TableCell>
                    <TableCell>{formatDate(project.createdAt)}</TableCell>
                    <TableCell>
                      {project.creator ? project.creator.name : <span className="text-muted-foreground">Unknown</span>}
                    </TableCell>
                    <TableCell>
                      {project.assignedUsers && project.assignedUsers.length > 0
                        ? project.assignedUsers.map((emp) => emp.name || emp.email).join(', ')
                        : <span className="text-muted-foreground">None</span>}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(project)}>
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="ml-2"
                            onClick={() => {
                              setDeleteId(String(project.id));
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this project?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Project' : 'Add Project'}</DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the project details.' : 'Enter details for the new project.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Project Name"
                value={currentProject.name}
                onChange={handleChange}
                required
                className="placeholder:text-gray-500"
              />
              <Input
                name="description"
                placeholder="Description"
                value={currentProject.description}
                onChange={handleChange}
                required
                className="placeholder:text-gray-500"
              />
              {editMode && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <RadioGroup
                    id="status"
                    name="status"
                    className="flex gap-4 mt-1"
                    value={currentProject.status}
                    onValueChange={val => setCurrentProject({ ...currentProject, status: val })}
                    required
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <div key={status} className="flex items-center gap-2">
                        <RadioGroupItem value={status} id={`status-${status}`} />
                        <Label htmlFor={`status-${status}`}>{status}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="flex flex-row w-full gap-[10%]">
                <div className="flex flex-col w-[40%]">
                  <Label htmlFor="startDate" className="mb-1">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    placeholder="Start Date"
                    value={currentProject.startDate}
                    onChange={handleChange}
                    required
                    className="placeholder:text-gray-500 w-full"
                  />
                </div>
                <div className="flex flex-col w-[40%]">
                  <Label htmlFor="endDate" className="mb-1">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    placeholder="End Date"
                    value={currentProject.endDate}
                    onChange={handleChange}
                    required
                    className="placeholder:text-gray-500 w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Assign Employees</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-between">
                      {selectedEmployeeIds.length > 0
                        ? users.filter((u) => selectedEmployeeIds.includes(String(u.id))).map((u) => u.name || u.email).join(', ')
                        : 'Select employees'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                    {users.filter((user) => {
                      if (Array.isArray(user.role)) {
                        return user.role.includes('user');
                      }
                      return user.role === 'user';
                    }).map((user) => (
                      <DropdownMenuCheckboxItem
                        key={user.id}
                        checked={selectedEmployeeIds.includes(String(user.id))}
                        onCheckedChange={() => handleEmployeeToggle(user.id)}
                      >
                        {user.name} ({user.email})
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DialogFooter>
                <Button type="submit">{editMode ? 'Update' : 'Create'}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {showCreateToast && (
          <div className="toast toast-end z-50 fixed">
            <div className="alert alert-success">
              <span>Project created successfully!</span>
            </div>
          </div>
        )}
        {showUpdateToast && (
          <div className="toast toast-end z-50 fixed">
            <div className="alert alert-info">
              <span>Project updated successfully!</span>
            </div>
          </div>
        )}
        {showDeleteToast && (
          <div className="toast toast-end z-50 fixed">
            <div className="alert alert-warning">
              <span>Project deleted successfully!</span>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
};

export default ManagerProject;
