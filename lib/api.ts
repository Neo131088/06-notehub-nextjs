import axios from 'axios';
import type { Note } from '../types/note';

export interface NotesProps {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export type CreateNotePayload = CreateNoteProps;

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: string;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const fetchNotes = async (params: FetchNotesParams) => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
  });

  return data;
};

export async function createNote(data: CreateNoteProps) {
  const res = await axios.post<Note>('/notes', data, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  });

  return res.data;
}

export async function deleteNote(id: Note['id']) {
  const { data } = await axios.delete(`/notes/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  });

  return data;
}

export async function fetchNoteById(noteId: Note['id']) {
  const { data } = await axios.get<Note>(`/notes/${noteId}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  });

  return data;
}
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}
export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});