"use client"
import LoadingSpinner from '@/components/LoadingSpinner';
import RequireAuth from '@/components/RequireAuth';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllProjects, respondToProject } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getDashboardLink } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Projects = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllProjects(token)
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [token]);

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
              <Link href="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Projects Assign to you</h1>
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
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>
                      {project.assignmentStatus === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                            disabled={actionLoading[project.id]}
                            onClick={async () => {
                              if (!token) return;
                              setActionLoading((prev) => ({ ...prev, [project.id]: true }));
                              try {
                                await respondToProject(project.id, 'accept', token);
                                setProjects((prev) =>
                                  prev.map((proj) =>
                                    proj.id === project.id ? { ...proj, assignmentStatus: 'Accepted' } : proj
                                  )
                                );
                              } finally {
                                setActionLoading((prev) => ({ ...prev, [project.id]: false }));
                              }
                            }}
                          >
                            {actionLoading[project.id] ? 'Accepting...' : 'Accept'}
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                            disabled={actionLoading[project.id]}
                            onClick={async () => {
                              if (!token) return;
                              setActionLoading((prev) => ({ ...prev, [project.id]: true }));
                              try {
                                await respondToProject(project.id, 'reject', token);
                                setProjects((prev) =>
                                  prev.map((proj) =>
                                    proj.id === project.id ? { ...proj, assignmentStatus: 'Rejected' } : proj
                                  )
                                );
                              } finally {
                                setActionLoading((prev) => ({ ...prev, [project.id]: false }));
                              }
                            }}
                          >
                            {actionLoading[project.id] ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <span className={`capitalize font-semibold ${project.assignmentStatus === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
                          {project.assignmentStatus}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </RequireAuth>
  );
};

export default Projects;
