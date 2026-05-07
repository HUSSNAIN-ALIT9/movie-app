"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const { user } = useAuthUser();

  const [moviesList] = useState<string[]>([]);

  // ✅ FIXED (hydration safe)
  const suggestions = search.trim()
    ? moviesList
        .filter((title) =>
          title.toLowerCase().startsWith(search.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim()) {
      router.push(`/movies?search=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex items-center justify-between bg-[#111218] px-6 py-3">

      {/* LOGO (UNCHANGED UI) */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">
          <span className="text-red-600">M</span>ovieFlix
        </span>
      </div>

      {/* LINKS */}
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-white hover:text-red-500 transition">
          Home
        </Link>

        <button
          onClick={() => router.push(user ? "/contact" : "/login")}
          className="text-white hover:text-red-500 transition"
        >
          Contact
        </button>

        <button
          onClick={() => router.push(user ? "/favourites" : "/login")}
          className="text-white hover:text-red-500 transition"
        >
          Favourites
        </button>

        <button
          onClick={() => router.push(user ? "/watchlist" : "/login")}
          className="text-white hover:text-red-500 transition"
        >
          Watchlist
        </button>
      </div>

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="relative group">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="
            px-4 py-2
            rounded-full
            bg-gray-800
            text-white
            w-64
            outline-none
            transition-all duration-300
            focus:w-72
            focus:bg-gray-700
          "
        />

        {/* ICON (SAFE) */}
        <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none group-focus-within:scale-110 transition-transform">
          🔍
        </span>

        {/* SUGGESTIONS */}
        {search && suggestions.length > 0 && (
          <div className="absolute top-12 left-0 w-64 bg-[#181920] rounded-lg shadow-lg z-50 overflow-hidden">

            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearch(item);
                  router.push(`/movies?search=${encodeURIComponent(item)}`);
                }}
                className="p-2 text-white hover:bg-gray-700 cursor-pointer transition"
              >
                {item}
              </div>
            ))}

          </div>
        )}
      </form>

      {/* AUTH */}
      <div className="flex gap-3 items-center">

        {!user ? (
          <>
            <button
              onClick={() => router.push("/login")}
              className="text-white hover:text-red-500 transition"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Signup
            </button>

            <button
              onClick={async () => {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                router.push("/");
              }}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              Google
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}