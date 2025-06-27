"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import { getProfileAxios, updateUser } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbEllipsis,
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

export default function EditProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getProfileAxios(token)
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
      })
      .catch(() => setError("Failed to load profile"));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    setLoading(true);
    setError("");
    try {
      await updateUser(user.id, { name, email }, token);
      router.push("/profile?updated=1");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
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
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/edit-profile">EditProfile</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>



      <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-medium">Name
            <Input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1" />
          </label>
          <label className="font-medium">Email
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </label>
          <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => router.push("/profile")} className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500">Cancel</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      </div>
    </RequireAuth>
  );
}
