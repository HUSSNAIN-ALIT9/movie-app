"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFavouriteMovies } from "@/services/favouritesService";
import { useAuthUser } from "@/hooks/useAuthUser";


export default function FavouritesPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setFetching(true);
      getFavouriteMovies().then(setMovies).finally(() => setFetching(false));
    }
  }, [user]);

  if (loading) return <div className="pt-24 text-center text-2xl font-bold">Loading...</div>;
  if (!user) return null;

  return (
    <div className="pt-24 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Favourites</h1>
      {fetching ? (
        <div className="text-center">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center text-gray-500">No favourite movies yet.</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
          {movies.map((movie, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-3 sm:p-5 w-full max-w-xs">
              <img src={movie.poster} alt="Movie Poster" className="rounded-lg mb-3 w-full h-40 sm:h-48 object-cover" />
              <h2 className="text-lg sm:text-xl font-bold mb-1">{movie.title}</h2>
              <p className="text-gray-500 mb-2 text-sm sm:text-base">{movie.genres}</p>
              <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">⭐ {movie.rating}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
