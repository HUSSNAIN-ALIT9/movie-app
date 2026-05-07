"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getFavouriteMovies,
  removeFavouriteMovie,
} from "@/services/favouritesService";

export default function FavouritesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH FAVOURITES ----------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const favs = await getFavouriteMovies();
        setMovies(favs);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ----------------🔥 OPTIMISTIC REMOVE (FAST UI) ----------------
  const handleRemove = async (movie: any) => {
    // 1. INSTANT UI UPDATE (NO DELAY)
    setMovies((prev) =>
      prev.filter((m) => m.id !== movie.id)
    );

    try {
      // 2. BACKGROUND FIREBASE UPDATE
      await removeFavouriteMovie(movie);
    } catch (error) {
      console.error(error);

      // ❗ rollback if error
      setMovies((prev) => [...prev, movie]);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="text-white p-6">Loading...</div>
    );
  }

  return (
    <main className="p-6 bg-[#111218] min-h-screen">

      <h1 className="text-2xl font-bold text-white mb-6">
        ❤️ Favourite Movies
      </h1>

      {movies.length === 0 ? (
        <p className="text-white">No favourites</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#181920] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >

              {/* IMAGE */}
              <img
                src={movie.poster}
                className="h-64 w-full object-cover transition-transform duration-300 hover:scale-110"
              />

              {/* CONTENT */}
              <div className="p-3">

                <h2 className="text-white font-semibold line-clamp-1">
                  {movie.title}
                </h2>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => handleRemove(movie)}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 transition-all py-2 text-white rounded-lg font-semibold"
                >
                  ❌ Remove Favourite
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </main>
  );
}