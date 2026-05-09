import "modern-normalize";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { movieService } from "../../services/movieService";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import { Toaster } from "react-hot-toast";
import { notifyNoMovies } from "../../services/toast";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../ReactPaginate/ReactPaginate";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: [query, page],

    queryFn: () => movieService(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data?.results && data.results.length === 0) {
      notifyNoMovies();
    }
  }, [data]);
  const closeModal = () => {
    setSelectedMovie(null);
  };
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={css.app}>
      <SearchBar
        onSubmit={(q) => {
          setQuery(q);
          setPage(1);
        }}
      />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <Pagination totalPages={totalPages} page={page} setPage={setPage} />
      )}
      {!isLoading && !isError && data?.results?.length > 0 && (
        <MovieGrid
          movies={data?.results || []}
          onSelect={(movie) => {
            setSelectedMovie(movie);
          }}
        />
      )}
      <Toaster position="top-center" reverseOrder={false} />
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </div>
  );
}

export default App;
