"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import {
  addFavouriteMovie,
  removeFavouriteMovie,
  getFavouriteMovies,
} from "@/services/favouritesService";

export default function MoviesPage() {
  const router = useRouter();

  const [liked, setLiked] = useState<any>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [userReady, setUserReady] = useState(false);

  // AUTH FIX (IMPORTANT)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUserReady(true);

      const favs = await getFavouriteMovies();

      const map: any = {};
      favs.forEach((m: any) => {
        map[m.id] = true;
      });

      setLiked(map);
    });

    return () => unsub();
  }, []);

  const movies = [
    {
      id: "ww84",
      title: "Wonder Woman 1984",
      poster_path: "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
      genres: "Action",
      vote_average: 6.8,
    },
    {
      id: "mulan",
      title: "Mulan",
      poster_path: "/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
      genres: "Action",
      vote_average: 7,
    },
  ];

  if (!userReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {movies.map((movie) => {
        const isLiked = liked[movie.id];

        return (
          <div key={movie.id} className="bg-white p-4 shadow rounded-xl">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="h-60 w-full object-cover rounded-lg"
            />

            <h2 className="text-xl font-bold mt-2">{movie.title}</h2>
            <p>{movie.genres}</p>

            <button
              disabled={processing === movie.id}
              className={`mt-3 px-4 py-2 rounded text-white ${
                isLiked ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={async () => {
                setProcessing(movie.id);

                const newState = !isLiked;

                // instant UI update
                setLiked((prev: any) => ({
                  ...prev,
                  [movie.id]: newState,
                }));


                // Sanitize movieData for Firebase (no undefined fields)
                const movieData = {
                  id: movie.id ? String(movie.id) : "",
                  title: movie.title || "Untitled",
                  genres: movie.genres || "",
                  vote_average: movie.vote_average || 0,
                  poster_path: movie.poster_path || "",
                  poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/800x400?text=No+Image",
                };

                if (newState) {
                  await addFavouriteMovie(movieData);
                } else {
                  await removeFavouriteMovie(movieData);
                }

                setProcessing(null);
              }}
            >
              {isLiked ? "Unlike" : "Like"}
            </button>
          </div>
        );
      })}
    </div>
  );
}