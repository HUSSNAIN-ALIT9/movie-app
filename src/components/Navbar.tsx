"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { user } = useAuthUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/movies?search=${encodeURIComponent(search)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      alert("Logout failed");
    }
  };

  return (
    <>
      <nav className="navbar w-full fixed top-0 left-0 z-50 flex items-center justify-between flex-nowrap">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* Movie Clapboard Logo (pixel-perfect, as per design) */}
          <span className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {/* Main body */}
              <rect x="4" y="12" width="24" height="14" rx="3" fill="#181920" stroke="#fff" strokeWidth="2"/>
              {/* Top clapboard */}
              <rect x="4" y="6" width="24" height="7" rx="2" fill="#23242b" stroke="#fff" strokeWidth="2"/>
              {/* Red diagonal stripes */}
              <rect x="6" y="7.5" width="4" height="2" rx="1" fill="#e50914" transform="rotate(-15 6 7.5)"/>
              <rect x="13" y="7.5" width="4" height="2" rx="1" fill="#e50914" transform="rotate(-15 13 7.5)"/>
              <rect x="20" y="7.5" width="4" height="2" rx="1" fill="#e50914" transform="rotate(-15 20 7.5)"/>
            </svg>
          </span>
          <span className="text-2xl font-bold tracking-tight">
            <span style={{ color: '#e50914' }}>M</span>ovieFlix
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center ml-8">
          <Link href="/" className="font-medium text-white hover:text-[#e50914] transition">Home</Link>
          <button
            className="font-medium text-white hover:text-[#e50914] transition bg-transparent border-none outline-none cursor-pointer"
            onClick={() => {
              if (!user) {
                router.push("/login");
              } else {
                router.push("/contact");
              }
            }}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            Contact
          </button>
          <button
            className="font-medium text-white hover:text-[#e50914] transition bg-transparent border-none outline-none cursor-pointer"
            onClick={() => {
              if (!user) {
                router.push("/login");
              } else {
                router.push("/favourites");
              }
            }}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            Favourite Movies
          </button>
          <button
            className="font-medium text-white hover:text-[#e50914] transition bg-transparent border-none outline-none cursor-pointer"
            onClick={() => {
              if (!user) {
                router.push("/login");
              } else {
                router.push("/watchlist");
              }
            }}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            Watch Movies
          </button>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex items-center mx-6 relative">
          <input
            className="search-box pr-10"
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 180 }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {/* Search Icon SVG */}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
        </form>

        {/* Auth Buttons */}
        <div className="flex gap-3 items-center">
          {!user && (
            <>
              {pathname !== "/login" && (
                <Link
                  href="/login"
                  className="btn-secondary"
                  style={{ fontSize: '1rem', padding: '0.4rem 1.2rem' }}>
                  Login
                </Link>
              )}
              {pathname !== "/signup" && (
                <Link
                  href="/signup"
                  className="btn-primary"
                  style={{
                    fontSize: '1rem',
                    padding: '0.4rem 1.2rem',
                    background: '#ff253a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 600
                  }}
                >
                  Signup
                </Link>
              )}
              <button
                onClick={async () => {
                  const provider = new GoogleAuthProvider();
                  try {
                    await signInWithPopup(auth, provider);
                    // Redirect to homepage after successful login
                    router.push("/");
                  } catch (error) {
                    alert("Google login failed");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-black bg-red-600 hover:bg-black hover:text-red-600 border-2 border-red-600 transition-all duration-300 shadow"
                style={{ fontSize: '1rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.711-1.57-3.922-2.531-6.656-2.531-5.523 0-10 4.477-10 10s4.477 10 10 10c5.75 0 9.563-4.031 9.563-9.719 0-.656-.07-1.156-.156-1.648z" fill="#FFC107"></path><path d="M3.152 7.345l3.281 2.406c.891-1.789 2.672-2.953 4.617-2.953 1.125 0 2.188.391 3.008 1.164l2.844-2.766c-1.711-1.57-3.922-2.531-6.656-2.531-3.797 0-7.031 2.484-8.406 6.031l3.312 2.649c.664-2.016 2.344-3.5 4.312-3.5z" fill="#FF3D00"></path><path d="M12 22c2.672 0 4.922-.883 6.563-2.406l-3.047-2.492c-.828.617-1.953.992-3.516.992-2.828 0-5.219-1.906-6.078-4.453l-3.242 2.5c1.523 3.008 4.734 5.359 8.32 5.359z" fill="#4CAF50"></path><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.711-1.57-3.922-2.531-6.656-2.531-5.523 0-10 4.477-10 10s4.477 10 10 10c5.75 0 9.563-4.031 9.563-9.719 0-.656-.07-1.156-.156-1.648z" fill="none"></path></g></svg>
                Google
              </button>
            </>
          )}
          {user && (
            <button
              className="btn-secondary"
              style={{ fontSize: '1rem', padding: '0.4rem 1.2rem' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
