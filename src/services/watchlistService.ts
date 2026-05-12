import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function addWatchlistMovie(movie: any) {
  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "watchlist", user.uid);

  const snap = await getDoc(ref);

  const key = String(movie.id);

  const newMovie = {
    id: movie.id,
    title: movie.title,

    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster,
  };

  let movies: any = {};
  if (snap.exists()) {
    movies = snap.data().movies || {};
  }
  movies[key] = newMovie;
  // Ensure movies is always a valid object
  await setDoc(ref, { movies: movies || {} });
}

export async function removeWatchlistMovie(movie: any) {
  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "watchlist", user.uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  let movies = data.movies || {};
  delete movies[String(movie.id)];
  // If movies is now empty, set to empty object
  if (Object.keys(movies).length === 0) {
    movies = {};
  }
  await setDoc(ref, { movies });
}

export async function getWatchlistMovies() {
  const user = auth.currentUser;

  if (!user) return [];

  const ref = doc(db, "watchlist", user.uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();

  return Object.values(data.movies || {});
}