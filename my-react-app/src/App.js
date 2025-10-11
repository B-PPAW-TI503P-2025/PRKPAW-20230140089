import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editId, setEditId] = useState(null);
  const API_URL = 'http://localhost:3001/api/books';

  // 🔹 Ambil data dari server (READ)
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  // 🔹 Tambah buku baru (CREATE)
  const handleAddBook = async () => {
    if (!title || !author) {
      alert('Title dan Author wajib diisi!');
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
      });
      const newBook = await res.json();
      setBooks([...books, newBook]);
      setTitle('');
      setAuthor('');
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  // 🔹 Hapus buku (DELETE)
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Yakin mau hapus buku ini?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setBooks(books.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  // 🔹 Edit buku (UPDATE)
  const handleEditBook = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
  };

  const handleUpdateBook = async () => {
    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author }),
      });
      const updatedBook = await res.json();
      setBooks(books.map((b) => (b.id === editId ? updatedBook : b)));
      setTitle('');
      setAuthor('');
      setEditId(null);
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        <h2>📚 Manajemen Buku Perpustakaan</h2>

        <input
          type="text"
          placeholder="Judul buku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px', margin: '5px', width: '200px' }}
        />
        <input
          type="text"
          placeholder="Nama penulis"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ padding: '8px', margin: '5px', width: '200px' }}
        />

        <button
          onClick={editId ? handleUpdateBook : handleAddBook}
          style={{
            padding: '8px 15px',
            margin: '5px',
            background: editId ? '#f39c12' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {editId ? 'Update Buku' : 'Tambah Buku'}
        </button>

        <h3>Daftar Buku:</h3>
        {books.length === 0 ? (
          <p>Belum ada data buku.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {books.map((book) => (
              <li
                key={book.id}
                style={{
                  border: '1px solid #ccc',
                  margin: '8px auto',
                  padding: '10px',
                  width: '400px',
                  borderRadius: '6px',
                }}
              >
                <strong>{book.title}</strong> — {book.author}
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => handleEditBook(book)}
                    style={{
                      padding: '5px 10px',
                      marginRight: '8px',
                      background: '#f1c40f',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    style={{
                      padding: '5px 10px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
