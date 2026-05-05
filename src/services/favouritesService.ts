import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth } from "@/lib/firebase";

const db = getFirestore();

export async function addFavouriteMovie(movie: any) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const ref = doc(db, "favourites", user.uid);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    await updateDoc(ref, { movies: arrayUnion(movie) });
  } else {
    await setDoc(ref, { movies: [movie] });
  }
}

export async function removeFavouriteMovie(movie: any) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const ref = doc(db, "favourites", user.uid);
  await updateDoc(ref, { movies: arrayRemove(movie) });
}

export async function getFavouriteMovies() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const ref = doc(db, "favourites", user.uid);
  const docSnap = await getDoc(ref);
  return docSnap.exists() ? docSnap.data().movies : [];
}
