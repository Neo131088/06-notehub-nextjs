'use client';

import { useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '@/lib/api';

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: keepPreviousData,
  });

  const handelSearchBox = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        {error && !data && <p>Something went wrong.</p>}
        {isLoading && <p>Loading, please wait...</p>}
        <SearchBox search={search} onChange={setSearch} />
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            onPageChange={newPage => setPage(newPage)}
            currentPage={page}
          />
        )}
        {
          <button onClick={openModal} className={css.button}>
            Create note +
          </button>
        }
      </div>
      {isSuccess && data && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {<NoteForm page={page} onClose={closeModal} />}
        </Modal>
      )}
    </div>
  );
}
export default NotesClient;