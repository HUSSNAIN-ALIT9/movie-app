"use client";

import { useEffect, useState } from "react";
import {
  addFavouriteMovie,
  removeFavouriteMovie,
  getFavouriteMovies,
} from "@/services/favouritesService";

import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link";

type Movie = {
  id: number;
  poster_path: string;
  backdrop_path?: string;
  title: string;
  release_date: string;
  vote_average: number;
  adult?: boolean;
  genres?: string;
  overview?: string; // ⭐ ADDED DESCRIPTION FIELD
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthUser();

  // ---------------- FETCH MOVIES ----------------
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        let all: Movie[] = [];

        for (let page = 1; page <= 3; page++) {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`
          );

          const data = await res.json();
          all = [...all, ...data.results];
        }

        setMovies(all);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  // ---------------- FETCH FAVS ----------------
  useEffect(() => {
    if (user) {
      getFavouriteMovies().then((data: any) =>
        setFavourites(data)
      );
    } else {
      setFavourites([]);
    }
  }, [user]);

  // ---------------- CHECK FAV ----------------
  const isFav = (movie: Movie) =>
    favourites.some((m) => m.id === movie.id);

  // ---------------- LIKE HANDLER ----------------
  const handleLike = async (movie: Movie) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const alreadyFav = isFav(movie);

    if (alreadyFav) {
      setFavourites((prev) =>
        prev.filter((m) => m.id !== movie.id)
      );
      await removeFavouriteMovie(movie);
    } else {
      setFavourites((prev) => [...prev, movie]);
      await addFavouriteMovie(movie);
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <main className="bg-[#111218] min-h-screen w-full">

      {/* ---------------- HERO ---------------- */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 pt-10 pb-8 gap-8">

        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Enjoy Your{" "}
            <span className="text-[#e50914]">
              Favourite Movies
            </span>
          </h1>

          <p className="text-gray-300 max-w-xl">
            Watch latest movies anytime anywhere.
          </p>

          <div className="flex gap-4">
            <Link href="/movies">
              <button className="py-3 px-8 rounded-lg bg-[#e50914] text-white">
                Watch Now
              </button>
            </Link>

            <Link href="/explore">
              <button className="py-3 px-8 rounded-lg bg-[#23242b] text-white">
                Explore
              </button>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={`https://image.tmdb.org/t/p/original${movies[0]?.backdrop_path}`}
            className="rounded-2xl w-full max-w-2xl object-cover"
          />
        </div>

      </section>

      {/* ---------------- MOVIES GRID ---------------- */}
      <section className="px-8 pb-10">

        <h2 className="text-2xl font-bold text-white mb-6">
          Trending Movies
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#181920] rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
            >

              {/* POSTER */}
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                className="h-64 object-cover"
              />

              <div className="p-3 flex flex-col gap-2">

                {/* TITLE */}
                <h3 className="text-white font-bold">
                  {movie.title}
                </h3>

                {/* DATE + RATING */}
                <p className="text-gray-400 text-xs">
                  {movie.release_date} • ⭐ {movie.vote_average}
                </p>

                {/* ⭐ SHORT DESCRIPTION */}
                <p className="text-gray-500 text-xs line-clamp-2">
                  {movie.overview
                    ? movie.overview
                    : "No description available for this movie."}
                </p>

                {/* LIKE BUTTON */}
                <button
                  onClick={() => handleLike(movie)}
                  className={`mt-2 w-full py-2 rounded font-semibold transition ${
                    isFav(movie)
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {isFav(movie)
                    ? "❤️ Remove Favourite"
                    : "🤍 Add Favourite"}
                </button>

                <Link
                  href="/favourites"
                  className="text-blue-400 text-xs mt-1 block"
                >
                  View Favourites →
                </Link>

              </div>
            </div>
          ))}

        </div>
      </section>

    </main>
  );
}