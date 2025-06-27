import { useAuth } from "../lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
