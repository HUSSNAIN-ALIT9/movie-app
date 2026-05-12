import { Suspense } from "react";
import MovieClient from "./MovieClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <MovieClient />
    </Suspense>
  );
}