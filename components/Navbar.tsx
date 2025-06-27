"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";


export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();         // wait for logout to complete
    router.push("/");       // then redirect to homepage
  };


  return (
    <nav className="w-full bg-background border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex flex-col items-start">
        <span className="text-xl font-bold text-primary">Employee Management System</span>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        {user && (
          <Button onClick={handleLogout} variant="destructive"
            className="rounded bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Sign Out
          </Button>

        )}
      </div>
    </nav>
  );
}
