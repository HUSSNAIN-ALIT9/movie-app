
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import {
  getFavouriteMovies,
  removeFavouriteMovie,
} from "@/services/favouritesService";

type Movie = {
  id: number;
  title: string;
  poster?: string;
};

export default function FavouritesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
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

        const favs = (await getFavouriteMovies()) as Movie[];

        setMovies(favs || []);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

    });

    return () => unsub();
  }, []);

  // ---------------- REMOVE FAVOURITE ----------------
  const handleRemove = async (movie: Movie) => {

    try {

      await removeFavouriteMovie(movie);

      setMovies((prev) =>
        prev.filter((m) => m.id !== movie.id)
      );

    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="text-white p-6 bg-[#111218] min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-6 bg-[#111218] min-h-screen">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-white mb-8">
        ❤️ Favourite Movies
      </h1>

      {/* EMPTY STATE */}
      {movies.length === 0 ? (

        <div className="flex items-center justify-center h-[60vh]">

          <p className="text-gray-400 text-lg">
            No favourite movies yet.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {movies.map((movie) => (

            <div
              key={`${movie.id}-${movie.title}`}
              className="bg-[#181920] rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
            >

              {/* IMAGE */}
              <img
                src={
                  movie.poster && movie.poster !== ""
                    ? movie.poster
                    : "/no-image.png"
                }
                className="h-72 w-full object-cover"
                alt={movie.title}
              />

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-3">

                {/* TITLE */}
                <h2 className="text-white font-semibold line-clamp-1">
                  {movie.title}
                </h2>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => handleRemove(movie)}
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
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

