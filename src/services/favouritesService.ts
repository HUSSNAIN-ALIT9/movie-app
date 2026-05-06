import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * ADD FAVOURITE
 */
export async function addFavouriteMovie(movie: any) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "favourites", user.uid);
  const snap = await getDoc(ref);

  const key = movie.id || movie.title.toLowerCase();

  const safeMovie = {
    id: key,
    title: movie.title,
    genres: movie.genres || "",
    rating: movie.vote_average || movie.rating || 0,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster ||
        "https://via.placeholder.com/800x400?text=No+Image",
  };

  let movies: any = {};

  if (snap.exists()) {
    movies = snap.data().movies || {};
  }

  movies[key] = safeMovie;

  await setDoc(ref, { movies });
}

/**
 * REMOVE FAVOURITE
 */
export async function removeFavouriteMovie(movie: any) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "favourites", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const movies = data.movies || {};

  const key = movie.id || movie.title.toLowerCase();

  delete movies[key];

  await setDoc(ref, { movies });
}

/**
 * GET ALL FAVOURITES
 */
export async function getFavouriteMovies() {
  const user = auth.currentUser;
  if (!user) return [];

  const ref = doc(db, "favourites", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();
  return Object.values(data.movies || {});
}