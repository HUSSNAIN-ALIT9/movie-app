
import {
  doc,
  setDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

// ================= ADD FAVOURITE =================
export async function addFavouriteMovie(movie: any) {

  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "favourites", user.uid);

  const newMovie = {
    id: movie.id || 0,
    title: movie.title || "",
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster || "",
  };

  await setDoc(
    ref,
    {
      movies: {
        [movie.id]: newMovie,
      },
    },
    { merge: true }
  );
}

// ================= REMOVE FAVOURITE =================
export async function removeFavouriteMovie(movie: any) {

  const user = auth.currentUser;

  if (!user) return;

  const ref = doc(db, "favourites", user.uid);

  await setDoc(
    ref,
    {
      movies: {
        [movie.id]: deleteField(),
      },
    },
    { merge: true }
  );
}

// ================= GET FAVOURITES =================
export async function getFavouriteMovies() {

  const user = auth.currentUser;

  if (!user) return [];

  const ref = doc(db, "favourites", user.uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();

  return Object.values(data.movies || {});
}

