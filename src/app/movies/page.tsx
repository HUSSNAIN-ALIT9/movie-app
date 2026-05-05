"use client";



import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { addFavouriteMovie, removeFavouriteMovie, getFavouriteMovies } from "@/services/favouritesService";


export default function MoviesPage() {
  const { user, loading } = useAuthUser();
  const router = useRouter();
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Get search from query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search")?.toLowerCase() || "";
      setSearchTerm(search);
      if (search) {
        setTimeout(() => {
          const ref = cardRefs.current[search];
          if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "center" });
            ref.classList.add("ring-4", "ring-red-500");
            setTimeout(() => ref.classList.remove("ring-4", "ring-red-500"), 2000);
          }
        }, 400);
      }
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return null;
  }

  // Sample movies data
  const movies = [
    {
      title: "Wonder Woman 1984",
      poster: "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
      genres: "Action, Adventure, Fantasy",
      rating: 6.8,
    },
    {
      title: "Mulan",
      poster: "https://image.tmdb.org/t/p/w500/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
      genres: "Action, Adventure, Drama",
      rating: 7.0,
    },
    {
      title: "Monster Hunter",
      poster: "https://image.tmdb.org/t/p/w500/ugZW8ocsrfgI95pnQ7wrmKDxIe.jpg",
      genres: "Action, Adventure, Fantasy",
      rating: 6.3,
    },
    {
      title: "Tenet",
      poster: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
      genres: "Action, Sci-Fi, Thriller",
      rating: 7.5,
    },
    {
      title: "Soul",
      poster: "https://image.tmdb.org/t/p/w500/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg",
      genres: "Animation, Family, Comedy",
      rating: 8.1,
    },
    {
      title: "The Croods: A New Age",
      poster: "https://image.tmdb.org/t/p/w500/tK1zy5BsCt1J4OzoDicXmr0UTFH.jpg",
      genres: "Animation, Family, Adventure",
      rating: 7.6,
    },
  ];

  // Filter movies if searchTerm
  const filteredMovies = searchTerm
    ? movies.filter((m) => m.title.toLowerCase().includes(searchTerm))
    : movies;

  // Render
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-indigo-100 py-16 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-10 text-center tracking-tight">All Movies</h1>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
        {filteredMovies.map((movie, idx) => (
          <div
            key={idx}
            ref={el => (cardRefs.current[movie.title.toLowerCase()] = el)}
            className="bg-white rounded-xl shadow-lg p-3 sm:p-5 w-full max-w-xs"
          >
            <img src={movie.poster} alt="Movie Poster" className="rounded-lg mb-3 w-full h-40 sm:h-48 object-cover" />
            <h2 className="text-lg sm:text-xl font-bold mb-1">{movie.title}</h2>
            <p className="text-gray-500 mb-2 text-sm sm:text-base">{movie.genres}</p>
            <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">⭐ {movie.rating}</span>
            <div className="flex flex-col gap-2 mt-3 justify-center items-center">
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-full font-bold transition-all duration-200 transform shadow-md text-xs sm:text-base 
                    ${liked[movie.title] ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'} 
                    ${processing === movie.title ? 'opacity-50 cursor-wait' : ''}`}
                  disabled={liked[movie.title] || processing === movie.title}
                  onClick={async () => {
                    setProcessing(movie.title);
                    await addFavouriteMovie(movie);
                    setLiked((prev) => ({ ...prev, [movie.title]: true }));
                    setProcessing(null);
                  }}
                >
                  👍 {liked[movie.title] ? 'Liked' : 'Like'}
                </button>
                <button
                  className={`px-3 py-1 rounded-full font-bold transition-all duration-200 transform shadow-md text-xs sm:text-base 
                    ${!liked[movie.title] ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-red-500 text-white'} 
                    ${processing === movie.title ? 'opacity-50 cursor-wait' : ''}`}
                  disabled={!liked[movie.title] || processing === movie.title}
                  onClick={async () => {
                    setProcessing(movie.title);
                    await removeFavouriteMovie(movie);
                    setLiked((prev) => ({ ...prev, [movie.title]: false }));
                    setProcessing(null);
                  }}
                >
                  👎 {!liked[movie.title] ? 'Dislike' : 'Disliked'}
                </button>
              </div>
              {/* Feedback text */}
              {processing === movie.title && (
                <span className="text-xs text-gray-500 mt-1">Processing...</span>
              )}
              {liked[movie.title] && (
                <span className="text-green-600 text-xs font-semibold mt-1">Added to Favourites!</span>
              )}
              {!liked[movie.title] && processing === null && (
                <span className="text-red-600 text-xs font-semibold mt-1">Not in Favourites</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
