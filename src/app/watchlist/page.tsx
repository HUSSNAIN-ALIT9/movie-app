"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WatchlistPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="pt-24 text-center text-2xl font-bold">Loading...</div>;
  if (!user) return null;

  return (
    <div className="pt-24 text-center text-2xl font-bold">Watch List Page (Coming Soon)</div>
  );
}
