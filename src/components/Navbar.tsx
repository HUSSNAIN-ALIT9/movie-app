"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  const { user } = useAuthUser();

  const [search, setSearch] = useState("");
  const [moviesList, setMoviesList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // FETCH MOVIES NAMES
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`
        );

        const data = await res.json();

        const names = (data.results || []).map((m: any) => m.title);
        setMoviesList(names);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  // FILTER
  const suggestions =
    search.trim()
      ? moviesList
          .filter((t) =>
            t.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6)
      : [];

  // SEARCH SUBMIT (IMPORTANT FIX)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/movies?search=${encodeURIComponent(search)}`);

    // clear UI after search
    setSearch("");
    setOpen(false);
  };

  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex items-center justify-between bg-[#111218] px-4 md:px-6 py-3">

      {/* LOGO */}
      <div className="text-xl md:text-2xl font-bold text-white">
        <span className="text-red-600">M</span>ovieFlix
      </div>

      {/* LINKS */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/" className="text-white hover:text-red-500 transition">
          Home
        </Link>

        <button onClick={() => router.push(user ? "/contact" : "/login")} className="text-white hover:text-red-500">
          Contact
        </button>

        <button onClick={() => router.push(user ? "/favourites" : "/login")} className="text-white hover:text-red-500">
          Favourites
        </button>

        <button onClick={() => router.push(user ? "/watchlist" : "/login")} className="text-white hover:text-red-500">
          Watchlist
        </button>
      </div>

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="relative hidden sm:block">

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search movies..."
          className="
            px-4 py-2
            rounded-full
            bg-gray-800
            text-white
            w-52 md:w-64
            outline-none
            transition-all duration-500 ease-in-out
            focus:w-80
            focus:bg-gray-700
            focus:shadow-[0_0_25px_rgba(255,0,0,0.45)]
            hover:scale-[1.02]
          "
        />

        {/* ICON */}
        <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
          🔍
        </span>

        {/* SUGGESTIONS (WITH ANIMATION FIX) */}
        {open && search && suggestions.length > 0 && (
          <div className="
            absolute top-12 left-0 w-72
            bg-[#181920]
            rounded-lg
            shadow-xl
            overflow-hidden
            z-50
            animate-[fadeIn_0.2s_ease-in-out]
          ">

            {suggestions.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                onClick={() => {
                  router.push(`/movies?search=${encodeURIComponent(item)}`);

                  setSearch("");
                  setOpen(false);
                }}
                className="
                  p-2
                  text-white
                  hover:bg-red-600
                  hover:pl-4
                  cursor-pointer
                  transition-all duration-200
                "
              >
                {item}
              </div>
            ))}

          </div>
        )}

      </form>

      {/* USER */}
      <div className="flex items-center gap-3">

        {user && (
          <span className="hidden md:block text-sm px-3 py-1 rounded bg-black text-red-500 border border-red-600">
            {user.displayName || "User"}
          </span>
        )}

        {!user ? (
          <>
            {pathname !== "/login" && (
              <button onClick={() => router.push("/login")} className="text-white hover:text-red-500">
                Login
              </button>
            )}

            {pathname !== "/signup" && (
              <button onClick={() => router.push("/signup")} className="bg-red-600 px-3 py-1 rounded text-white">
                Signup
              </button>
            )}
          </>
        ) : (
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded text-white">
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}