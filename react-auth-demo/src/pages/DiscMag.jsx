import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DiscMag() {
    const [discs, setDiscs] = useState([]);
    const [newDisc, setNewDisc] = useState({
        title: '',
        price: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDiscs();
    }, []);

    const fetchDiscs = async () => {
        try {
            const res = await axios.get('http://localhost:8080/rest/discmag');
            setDiscs(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch disc magazines');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewDisc((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/rest/discmag', newDisc);
            setNewDisc({ title: '', price: '' });
            fetchDiscs();
        } catch (err) {
            alert('Error adding: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this disc magazine?')) return;
        try {
            await axios.delete(`http://localhost:8080/rest/discmag/${id}`);
            setDiscs(discs.filter((d) => d.id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    if (loading) return <div className="text-center text-white mt-20 text-xl">Loading disc magazines...</div>;
    if (error) return <div className="text-center text-red-600 mt-20">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold text-center text-gray-200 mb-12">Disc Magazines</h1>

            <form
                onSubmit={handleAdd}
                className="bg-zinc-800 p-8 rounded-2xl shadow-md border border-zinc-700 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                <input
                    className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="title"
                    placeholder="Title"
                    value={newDisc.title}
                    onChange={handleChange}
                    required
                />
                <input
                    className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newDisc.price}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    className="sm:col-span-2 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl shadow-md"
                >
                    ➕ Add Disc Magazine
                </button>
            </form>

            <div className="grid grid-cols-1 gap-6">
                {discs.map((disc) => (
                    <div
                        key={disc.id}
                        className="bg-zinc-800 text-white rounded-2xl p-6 border border-zinc-700 shadow-md hover:shadow-xl transition"
                    >
                        <h2 className="text-2xl font-semibold mb-2">{disc.title}</h2>
                        <p className="text-zinc-300 mb-2">💵 Price: ${disc.price}</p>
                        <button
                            onClick={() => handleDelete(disc.id)}
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

export default DiscMag;
