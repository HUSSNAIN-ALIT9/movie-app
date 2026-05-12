"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import {
  addFavouriteMovie,
  removeFavouriteMovie,
  getFavouriteMovies,
} from "@/services/favouritesService";

type Movie = {
  id: number | string;
  title: string;
  poster_path: string;
  overview?: string;
  vote_average?: number;
};

export default function MoviesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("search") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [liked, setLiked] = useState<any>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [userReady, setUserReady] = useState(false);

  // AUTH
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

  // FETCH MOVIES
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        const url = query
          ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, [query]);

  if (!userReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-[#111218]">

      {movies.length === 0 ? (
        <p className="text-white">No movies found</p>
      ) : (
        movies.map((movie: any) => {
          const isLiked = liked[movie.id];

          return (
            <div
              key={movie.id}
              className="bg-[#181920] text-white rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300"
            >

              {/* IMAGE */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-image.png"
                }
                className="h-64 w-full object-cover"
              />

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-2">

                {/* TITLE */}
                <h2 className="text-lg font-bold">
                  {movie.title}
                </h2>

                {/* RATING */}
                <p className="text-sm text-yellow-400">
                  ⭐ {movie.vote_average || "N/A"}
                </p>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-400 line-clamp-3">
                  {movie.overview
                    ? movie.overview
                    : "No description available for this movie."}
                </p>

                {/* LIKE BUTTON (IMPROVED LIKE HOME PAGE) */}
                <button
                  disabled={processing === movie.id}
                  className={`mt-3 py-2 rounded font-semibold transition-all duration-300 ${
                    isLiked
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={async () => {
                    setProcessing(movie.id);

                    const newState = !isLiked;

                    setLiked((prev: any) => ({
                      ...prev,
                      [movie.id]: newState,
                    }));

                    const movieData = {
                      id: String(movie.id),
                      title: movie.title,
                      genres: "",
                      vote_average: movie.vote_average || 0,
                      poster_path: movie.poster_path || "",
                      poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "",
                    };

                    if (newState) {
                      await addFavouriteMovie(movieData);
                    } else {
                      await removeFavouriteMovie(movieData);
                    }

                    setProcessing(null);
                  }}
                >
                  {isLiked ? "❤️ Remove Favourite" : "🤍 Add Favourite"}
                </button>

              </div>
            </div>
          );
        })
      )}

    </div>
  );
}