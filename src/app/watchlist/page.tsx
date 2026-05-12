  "use client";

  import { useEffect, useState } from "react";

  import { onAuthStateChanged } from "firebase/auth";

  import { auth } from "@/lib/firebase";

  import {
    getWatchlistMovies,
    removeWatchlistMovie,
  } from "@/services/watchlistService";

  export default function WatchlistPage() {
    const [movies, setMovies] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    // FETCH WATCHLIST
    useEffect(() => {
      const unsub = onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            setMovies([]);

            setLoading(false);

            return;
          }

          try {
            const data =
              await getWatchlistMovies();

            setMovies(data);
          } catch (err) {
            console.error(err);
          }

          setLoading(false);
        }
      );

      return () => unsub();
    }, []);

    // REMOVE
    const handleRemove = async (
      movie: any
    ) => {
      setMovies((prev) =>
        prev.filter((m) => m.id !== movie.id)
      );

      await removeWatchlistMovie(movie);
    };

    // LOADING
    if (loading) {
      return (
        <div className="text-white p-10">
          Loading...
        </div>
      );
    }

    return (
      <main className="p-6 bg-[#111218] min-h-screen">

        <h1 className="text-2xl font-bold text-white mb-6">
          📌 Watchlist Movies
        </h1>

        {movies.length === 0 ? (
          <p className="text-white">
            No watchlist movies
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            {movies.map((movie) => (

              <div
                key={movie.id}
                className="bg-[#181920] rounded-xl overflow-hidden flex flex-col hover:scale-105 transition"
              >

                {/* IMAGE */}
                <img
                  src={movie.poster}
                  className="h-64 w-full object-cover"
                />

                {/* CONTENT */}
                <div className="p-3">

                  <h2 className="text-white font-semibold">
                    {movie.title}
                  </h2>

                  <button
                    onClick={() =>
                      handleRemove(movie)
                    }
                    className="mt-3 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    ❌ Remove Watchlist
                  </button>

                </div>
              </div>

            ))}

          </div>
        )}
      </main>
    );
  }