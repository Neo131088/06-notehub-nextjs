'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api'; // 🔹 імпорт типу на верхівці
import { SearchBox } from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

import css from './NotesPage.module.css';

function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Відкриття/закриття модалки
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // React Query для нотаток
  const { data, isSuccess, isLoading, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, search }),
    placeholderData: undefined,
    staleTime: 5000, // 🔹 кешуємо дані 5 секунд
  });

  // Debounce для пошуку
  const handleSearchBox = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // скидаємо на першу сторінку при пошуку
  }, 300);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        {error && !data && <p>Something went wrong.</p>}
        {isLoading && <p>Loading, please wait...</p>}

        <SearchBox value={search} onChange={handleSearchBox} />

        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </div>

      {isSuccess && data && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm page={page} onClose={closeModal} /> {/* page повинен бути у NoteFormProps */}
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;