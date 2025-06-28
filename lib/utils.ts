import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns the dashboard path based on user role (handles string or array)
export function getDashboardLink(user: any) {
  let role = "";
  if (Array.isArray(user?.role)) {
    role = user.role[0]?.trim().toLowerCase() || "";
  } else if (typeof user?.role === "string") {
    role = user.role.trim().toLowerCase();
  }
  if (role === "admin") return "/dashboard/admin-dashboard";
  if (role === "manager") return "/dashboard/manager-dashboard";
  return "/dashboard";
}
