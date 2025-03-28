import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Book() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        price: '',
        quantity: '',
        description: '',
        copies: ''
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/rest/book');
            setBooks(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch books.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBook((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/rest/book', newBook);
            setNewBook({ title: '', author: '', isbn: '', price: '', quantity: '', description: '', copies: '' });
            fetchBooks();
        } catch (err) {
            alert('Failed to add book: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book?')) return;
        try {
            await axios.delete(`http://localhost:8080/rest/book/${id}`);
            setBooks(books.filter((b) => b.id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    if (loading) return <div className="text-center text-xl mt-20">Loading books...</div>;
    if (error) return <div className="text-center text-red-600 mt-20">Error: {error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold text-center text-gray-200 mb-12">📚 Book List</h1>

            <form
                onSubmit={handleAddBook}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-10 rounded-2xl shadow-md border border-zinc-700 mb-12"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" name="title" placeholder="Title" value={newBook.title} onChange={handleChange} required />
                    <input className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" name="author" placeholder="Author" value={newBook.author} onChange={handleChange} required />
                    <input className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" name="isbn" placeholder="ISBN" value={newBook.isbn} onChange={handleChange} required />
                    <input className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" name="price" type="number" placeholder="Price" value={newBook.price} onChange={handleChange} required />
                    <input className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" name="quantity" type="number" placeholder="Quantity" value={newBook.quantity} onChange={handleChange} required />
                    <input className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" name="copies" type="number" placeholder="Copies" value={newBook.copies} onChange={handleChange} required />
                    <textarea className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1 sm:col-span-2 min-h-[100px]" name="description" placeholder="Description" value={newBook.description} onChange={handleChange} />
                </div>
                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl shadow-md"
                >
                    ➕ Add Book
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="bg-zinc-800 text-white rounded-2xl p-6 border border-zinc-700 shadow-md hover:shadow-xl transition">
                        <h2 className="text-2xl font-semibold mb-2">{book.title}</h2>
                        <p className="text-zinc-300 mb-1"><span className="font-medium">Author:</span> {book.author}</p>
                        <p className="text-zinc-400 mb-1"><span className="font-medium">ISBN:</span> {book.isbn}</p>
                        <p className="text-zinc-400 mb-1"><span className="font-medium">Description:</span> {book.description}</p>
                        <p className="text-zinc-300 mb-1"><span className="font-medium">Price:</span> ${book.price}</p>
                        <p className="text-zinc-300 mb-4"><span className="font-medium">Quantity:</span> {book.quantity} | Copies: {book.copies}</p>
                        <button
                            onClick={() => handleDelete(book.id)}
                            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 px-4 rounded-xl"
                        >
                            ❌ Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Book;
