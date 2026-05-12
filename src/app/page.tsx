"use client";

import { useEffect, useState } from "react";
import {
  addFavouriteMovie,
  removeFavouriteMovie,
  getFavouriteMovies,
} from "@/services/favouritesService";

import {
  addWatchlistMovie,
  removeWatchlistMovie,
  getWatchlistMovies,
} from "@/services/watchlistService";

import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link";

type Movie = {
  id: number;
  poster_path?: string;
  backdrop_path?: string;
  title: string;
  release_date?: string;
  vote_average?: number;
  adult?: boolean;
  genres?: string;
  overview?: string;
  poster?: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthUser();

  // FETCH MOVIES
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

          all = [...all, ...(data.results || [])];
        }

        // REMOVE DUPLICATES
        const uniqueMovies = Array.from(
          new Map(all.map((movie) => [movie.id, movie])).values()
        );

        setMovies(uniqueMovies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // FETCH FAVOURITES
  useEffect(() => {
    if (user?.uid) {
      getFavouriteMovies()
        .then((data: any) => {
          setFavourites(data || []);
        })
        .catch(console.error);
    } else {
      setFavourites([]);
    }
  }, [user]);

  // FETCH WATCHLIST
  useEffect(() => {
    if (user?.uid) {
      getWatchlistMovies()
        .then((data: any) => {
          setWatchlist(data || []);
        })
        .catch(console.error);
    } else {
      setWatchlist([]);
    }
  }, [user]);

  // CHECK FAV
  const isFav = (movie: Movie) =>
    favourites.some((m) => Number(m.id) === Number(movie.id));

  // CHECK WATCHLIST
  const isWatchlist = (movie: Movie) =>
    watchlist.some((m) => Number(m.id) === Number(movie.id));

  // LIKE HANDLER (FAST UI)
  const handleLike = async (movie: Movie) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const alreadyFav = isFav(movie);

    // INSTANT UI UPDATE
    if (alreadyFav) {
      setFavourites((prev) =>
        prev.filter((m) => m.id !== movie.id)
      );
    } else {
      setFavourites((prev) => [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
        },
      ]);
    }

    try {
      // FIREBASE UPDATE
      if (alreadyFav) {
        await removeFavouriteMovie(movie);
      } else {
        await addFavouriteMovie(movie);
      }
    } catch (error) {
      console.error(error);

      // ROLLBACK
      if (alreadyFav) {
        setFavourites((prev) => [
          ...prev,
          {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "",
          },
        ]);
      } else {
        setFavourites((prev) =>
          prev.filter((m) => m.id !== movie.id)
        );
      }
    }
  };

  // WATCHLIST HANDLER (FAST UI)
  const handleWatchlist = async (movie: Movie) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const alreadyAdded = isWatchlist(movie);

    // INSTANT UI UPDATE
    if (alreadyAdded) {
      setWatchlist((prev) =>
        prev.filter((m) => m.id !== movie.id)
      );
    } else {
      setWatchlist((prev) => [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "",
        },
      ]);
    }

    try {
      // FIREBASE UPDATE
      if (alreadyAdded) {
        await removeWatchlistMovie(movie);
      } else {
        await addWatchlistMovie(movie);
      }
    } catch (error) {
      console.error(error);

      // ROLLBACK
      if (alreadyAdded) {
        setWatchlist((prev) => [
          ...prev,
          {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "",
          },
        ]);
      } else {
        setWatchlist((prev) =>
          prev.filter((m) => m.id !== movie.id)
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-[#111218] min-h-screen w-full">

      {/* HERO */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-8 pt-10 pb-8 gap-8">

        <div className="flex-1 flex flex-col gap-6">

          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            Enjoy Your{" "}
            <span className="text-[#e50914]">
              Favourite Movies
            </span>
          </h1>

          <p className="text-gray-300 max-w-xl">
            Watch latest movies anytime anywhere.
          </p>

          <div className="flex gap-4 flex-wrap">

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

          {movies[0]?.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`}
              className="rounded-2xl w-full max-w-2xl object-cover"
              alt="Hero Banner"
            />
          )}

        </div>

      </section>

      {/* MOVIES GRID */}
      <section className="px-4 md:px-8 pb-10">

        <h2 className="text-2xl font-bold text-white mb-6">
          Trending Movies
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {movies.map((movie) => {
            const fav = isFav(movie);

            return (
              <div
                key={`${movie.id}-${movie.title}`}
                className="bg-[#181920] rounded-xl overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300"
              >

                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "/no-image.png"
                  }
                  className="h-64 object-cover"
                  alt={movie.title}
                />

                <div className="p-3 flex flex-col gap-2">

                  <h3 className="text-white font-bold">
                    {movie.title}
                  </h3>

                  <p className="text-gray-400 text-xs">
                    {movie.release_date || "Unknown"} • ⭐{" "}
                    {movie.vote_average || 0}
                  </p>

                  <p className="text-gray-500 text-xs line-clamp-2">
                    {movie.overview
                      ? movie.overview
                      : "No description available for this movie."}
                  </p>

                  <button
                    onClick={() => handleLike(movie)}
                    className={`mt-2 w-full py-2 rounded font-semibold transition ${
                      fav
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {fav
                      ? "❤️ Remove Favourite"
                      : "🤍 Add Favourite"}
                  </button>

                  <button
                    onClick={() => handleWatchlist(movie)}
                    className={`mt-2 w-full py-2 rounded font-semibold transition ${
                      isWatchlist(movie)
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {isWatchlist(movie)
                      ? "⭐ Remove Watchlist"
                      : "📌 Add Watchlist"}
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      </section>

    </main>
  );
}