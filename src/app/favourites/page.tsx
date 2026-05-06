"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getFavouriteMovies } from "@/services/favouritesService";

export default function FavouritesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const favs = await getFavouriteMovies();
      setMovies(favs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {movies.length === 0 ? (
        <p>No favourites</p>
      ) : (
        movies.map((movie: any) => (
          <div key={movie.id} className="bg-white shadow rounded-xl p-4">
            <img
              src={
                movie.poster?.startsWith("http")
                  ? movie.poster
                  : `https://image.tmdb.org/t/p/w500${movie.poster}`
              }
              className="h-60 w-full object-cover rounded-lg"
            />

            <h2 className="text-xl font-bold mt-2">{movie.title}</h2>
            <p>{movie.genres}</p>
          </div>
        ))
      )}
    </div>
  );
}