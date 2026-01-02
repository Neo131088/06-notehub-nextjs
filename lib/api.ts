import axios from 'axios';
import type { Note } from '../types/note';

export interface NotesProps {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: string;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchNotes(
  page: number,
  search: string
): Promise<NotesProps> {
  const { data } = await axios.get<NotesProps>('/notes', {
    params: {
      page: `${page}`,
      perPage: 12,
      search: `${search}`,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  });

  return data;
}

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