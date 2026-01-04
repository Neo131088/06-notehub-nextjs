import axios from 'axios';
import type { Note } from '../types/note';



export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: string;
}

export type CreateNotePayload = CreateNoteProps;



const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!NOTEHUB_TOKEN) {
  throw new Error('NEXT_PUBLIC_NOTEHUB_TOKEN is not defined');
}

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});


export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      perPage: 12,
      ...params,
    },
  });

  return data;
}

export async function createNote(
  payload: CreateNotePayload
): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function deleteNote(
  id: Note['id']
): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function fetchNoteById(
  id: Note['id']
): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}