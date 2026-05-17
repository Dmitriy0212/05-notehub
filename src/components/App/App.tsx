import "modern-normalize";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import { useState, useEffect } from "react";
import { fetchNotes } from "../../services/notesService";
import { createNote } from "../../services/notesService";
import { deleteNote } from "../../services/notesService";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { notifyNoNote } from "../../services/toast";
function App() {
  const [createNoteThis, setCreateNoteThis] = useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: () =>
      fetchNotes({
        page,
        search: query || undefined,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setQuery(value);
  }, 500);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const mutationsec = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const handleCreateNote = (noteData: {
    title: string;
    content: string;
    tag: string;
  }) => {
    mutation.mutate(noteData);
  };

  const handleDeleteNote = (noteData: string) => {
    mutationsec.mutate(noteData);
  };
  const openModal = () => {
    setCreateNoteThis(true);
  };
  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      notifyNoNote();
    }
  }, [data]);
  const closeModal = () => {
    setCreateNoteThis(false);
  };
  const totalPages = data?.totalPages ?? 0;
  useEffect(() => {
    setPage(1);
  }, [query]);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={input}
          onChange={(val) => {
            setInput(val);
            debouncedSetQuery(val);
          }}
        />

        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isFetching && isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
      {createNoteThis && (
        <Modal
          onClose={closeModal}
          onSubmit={handleCreateNote}
          isLoading={mutation.isPending}
        />
      )}
    </div>
  );
}

export default App;
