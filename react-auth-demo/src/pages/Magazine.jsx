import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Magazine() {
    const [mags, setMags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMag, setNewMag] = useState({
        title: '',
        description: '',
        publisher: '',
        pageCount: '',
        price: ''
    });

    useEffect(() => {
        fetchMags();
    }, []);

    const fetchMags = async () => {
        try {
            const response = await axios.get('http://localhost:8080/rest/magazine');
            setMags(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch magazines.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMag((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/rest/magazine', newMag);
            setNewMag({
                title: '',
                description: '',
                publisher: '',
                price: ''
            });
            fetchMags();
        } catch (err) {
            alert('Failed to add magazine: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this magazine?')) return;
        try {
            await axios.delete(`http://localhost:8080/rest/magazine/${id}`);
            setMags(mags.filter((m) => m.id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    if (loading) return <div className="text-center text-xl mt-20 text-white">Loading magazines...</div>;
    if (error) return <div className="text-center text-red-600 mt-20">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold text-center text-gray-200 mb-12"> Magazines</h1>

            <form
                onSubmit={handleAdd}
                className="bg-zinc-800 p-8 rounded-2xl shadow-md border border-zinc-700 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                <input
                    className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="title"
                    placeholder="Title"
                    value={newMag.title}
                    onChange={handleChange}
                    required
                />
                <input
                    className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="publisher"
                    placeholder="Publisher"
                    value={newMag.publisher}
                    onChange={handleChange}
                    required
                />
                <input
                    className="bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={newMag.price}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="sm:col-span-2 bg-zinc-700 text-white rounded-xl px-5 py-3 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                    name="description"
                    placeholder="Description"
                    value={newMag.description}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="sm:col-span-2 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl shadow-md"
                >
                    ➕ Add Magazine
                </button>
            </form>

            <div className="grid grid-cols-1 gap-6">
                {mags.map((mag) => (
                    <div
                        key={mag.id}
                        className="bg-zinc-800 text-white rounded-2xl p-6 border border-zinc-700 shadow-md hover:shadow-xl transition"
                    >
                        <h2 className="text-2xl font-semibold mb-2">{mag.title}</h2>
                        <p className="text-zinc-400 italic">{mag.publisher}</p>
                        <p className="text-zinc-300">{mag.description}</p>
                        <p className="text-sm mt-2">   ${mag.price}</p>
                        <button
                            onClick={() => handleDelete(mag.id)}
                            className="mt-4 w-full bg-red-600 hover:bg-red-700 transition text-white py-2 px-4 rounded-xl"
                        >
                            ❌ Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Magazine;
