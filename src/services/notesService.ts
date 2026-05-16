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
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${VITE_API_KEY}`,
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
