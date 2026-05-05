
"use client";
import { useEffect, useState } from "react";
import { addFavouriteMovie, getFavouriteMovies } from "@/services/favouritesService";
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
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuthUser();
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [favLoading, setFavLoading] = useState(false);

  // Fetch user's favourites
  useEffect(() => {
    if (user) {
      setFavLoading(true);
      getFavouriteMovies().then(setFavourites).finally(() => setFavLoading(false));
    } else {
      setFavourites([]);
    }
  }, [user]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setError("TMDb API key is missing. Please check your .env.local file.");
          setLoading(false);
          return;
        }
        let allMovies: Movie[] = [];
        for (let page = 1; page <= 3; page++) {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
          );
          if (!res.ok) {
            setError("Failed to fetch movies from TMDb API. Please check your API key and internet connection.");
            setLoading(false);
            return;
          }
          const data = await res.json();
          if (data.results) {
            // Filter out adult movies
            const filtered = data.results.filter((movie: Movie) => !movie.adult);
            allMovies = allMovies.concat(filtered);
          }
        }
        setMovies(allMovies);
        setLoading(false);
      } catch (err) {
        setError("An unexpected error occurred while fetching movies.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Check if a movie is in favourites
  const isFavourite = (movie: Movie) => {
    return favourites.some(fav => fav.id === movie.id);
  };

  // Handle like button click
  const handleLike = async (movie: Movie) => {
    if (!user) {
      alert("Please login to add favourites.");
      return;
    }
    try {
      await addFavouriteMovie(movie);
      setFavourites(prev => [...prev, movie]);
    } catch (e) {
      alert("Failed to add favourite.");
    }
  };

  return (
    <main className="bg-[#111218] min-h-screen w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 pt-10 pb-8 gap-8">
        <div className="flex-1 flex flex-col items-start justify-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Enjoy Your <span className="text-[#e50914]">Favourite Movies</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Watch the latest and most popular movies anytime, anywhere.
          </p>
          <div className="flex gap-4">
            <Link href="/movies">
              <button className="py-3 px-8 rounded-lg font-semibold text-white bg-[#e50914] hover:bg-[#b0060f] transition-all duration-300 shadow">
                Watch Now
              </button>
            </Link>
            <Link href="/explore">
              <button className="py-3 px-8 rounded-lg font-semibold text-white bg-[#23242b] hover:bg-[#33354a] transition-all duration-300 shadow">
                Explore
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {movies.length > 0 && movies[0].backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`}
              alt={movies[0].title}
              className="rounded-2xl shadow-lg w-full max-w-2xl object-cover"
              style={{ minHeight: 320, maxHeight: 400 }}
              onError={e => (e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image")}
            />
          ) : (
            <img
              src="https://via.placeholder.com/800x400?text=No+Image"
              alt="No Banner"
              className="rounded-2xl shadow-lg w-full max-w-2xl object-cover"
              style={{ minHeight: 320, maxHeight: 400 }}
            />
          )}
        </div>
      </section>

      {/* Trending Movies from TMDb API */}
      <section className="px-8 pb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Trending Movies</h2>
        {error ? (
          <div className="text-red-500 text-lg font-semibold py-8">{error}</div>
        ) : loading ? (
          <div className="text-white">Loading...</div>
        ) : movies.length === 0 ? (
          <div className="text-white">No movies found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-[#181920] rounded-xl shadow p-3 flex flex-col items-center relative">
                {/* Like Button */}
                <button
                  className="absolute top-2 left-2 z-10 text-2xl focus:outline-none"
                  onClick={() => handleLike(movie)}
                  aria-label={isFavourite(movie) ? "Remove from favourites" : "Add to favourites"}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  disabled={isFavourite(movie)}
                >
                  {isFavourite(movie) ? (
                    <span style={{ color: '#e50914' }}>&#10084;&#65039;</span> // filled heart
                  ) : (
                    <span style={{ color: '#fff' }}>&#9825;</span> // empty heart
                  )}
                </button>
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg mb-2 w-full h-40 object-cover"
                  onError={e => (e.currentTarget.src = "https://via.placeholder.com/200x300?text=No+Image")}
                />
                <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                <p className="text-gray-400 text-xs">{movie.release_date}</p>
                <span className="text-yellow-400 font-bold">{movie.vote_average}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}