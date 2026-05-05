"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthUser();

  // Helper to handle protected routes
  const handleNav = (href: string, protectedRoute = false) => {
    if (protectedRoute && !user) {
      router.push("/login");
    } else {
      router.push(href);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-16 bg-[#181920] flex flex-col items-center pt-24 z-50 gap-6 shadow-lg">
      {/* Home */}
      <button
        className={`sidebar-btn ${pathname === "/" ? "active" : ""}`}
        title="Home"
        onClick={() => handleNav("/")}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path d="M3 12L12 4l9 8"/><path d="M9 21V9h6v12"/></svg>
      </button>
      {/* Favourite */}
      <button
        className={`sidebar-btn ${pathname.startsWith("/favourites") ? "active" : ""}`}
        title="Favourite Movies"
        onClick={() => handleNav("/favourites", true)}
      >
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path d="M12 21s-6-4.35-9-8.5C-1.5 7.5 3.5 3 8.5 7.5L12 11l3.5-3.5C20.5 3 25.5 7.5 21 12.5c-3 4.15-9 8.5-9 8.5z"/></svg>
      </button>
      {/* Watchlist */}
      <button
        className={`sidebar-btn ${pathname.startsWith("/watchlist") ? "active" : ""}`}
        title="Watch Movies"
        onClick={() => handleNav("/watchlist", true)}
      >
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><path d="M5 3v18l7-5 7 5V3z"/></svg>
      </button>
      {/* Contact */}
      <button
        className={`sidebar-btn ${pathname.startsWith("/contact") ? "active" : ""}`}
        title="Contact"
        onClick={() => handleNav("/contact")}
      >
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 9L2 4"/></svg>
      </button>
    </aside>
  );
}
