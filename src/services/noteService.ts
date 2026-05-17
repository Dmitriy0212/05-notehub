import axios from "axios";
import { type Note } from "../types/note";

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
interface CreateNoteDto {
  title: string;
  content: string;
  tag: string;
}
const VITE_NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>("/notes", {
    params,
  });

  return data;
};
export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
