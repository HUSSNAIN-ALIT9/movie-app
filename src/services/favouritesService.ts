import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function addFavouriteMovie(movie: any) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "favourites", user.uid);
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

  await setDoc(ref, { movies });
}

export async function removeFavouriteMovie(movie: any) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "favourites", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const movies = data.movies || {};

  delete movies[String(movie.id)];

  await setDoc(ref, { movies });
}

export async function getFavouriteMovies() {
  const user = auth.currentUser;
  if (!user) return [];

  const ref = doc(db, "favourites", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();
  return Object.values(data.movies || {});
}