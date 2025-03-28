import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Ticket() {
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({
        title: '',
        description: '',
        price: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await axios.get('http://localhost:8080/rest/ticket');
            setTickets(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch tickets');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTicket((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/rest/ticket', newTicket);
            setNewTicket({ title: '', description: '', price: '', quantity: '' });
            fetchTickets();
        } catch (err) {
            alert('Failed to add ticket: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ticket?')) return;
        try {
            await axios.delete(`http://localhost:8080/rest/ticket/${id}`);
            setTickets(tickets.filter((t) => t.id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    if (loading) return <div className="text-center mt-20 text-xl text-white">Loading...</div>;
    if (error) return <div className="text-center text-red-600 mt-20">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl text-center text-white font-semibold mb-10"> Tickets</h1>

            <form onSubmit={handleAdd} className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-800 p-6 rounded-xl shadow-md">
                <input name="title" value={newTicket.title} onChange={handleChange} placeholder="Title" required className="p-3 rounded-lg text-white bg-zinc-700" />
                <input name="price" type="number" value={newTicket.price} onChange={handleChange} placeholder="Price" required className="p-3 rounded-lg text-white bg-zinc-700" />
                <input name="quantity" type="number" value={newTicket.quantity} onChange={handleChange} placeholder="Quantity" required className="p-3 rounded-lg text-white bg-zinc-700" />
                <textarea name="description" value={newTicket.description} onChange={handleChange} placeholder="Description" className="col-span-1 sm:col-span-2 p-3 rounded-lg text-white bg-zinc-700 min-h-[80px]" />
                <button type="submit" className="col-span-1 sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">➕ Add Ticket</button>
            </form>

            <div className="grid gap-6">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-zinc-800 text-white p-6 rounded-xl shadow-md border border-zinc-700">
                        <h2 className="text-2xl font-semibold">{ticket.title}</h2>
                        <p className="text-zinc-400">{ticket.description}</p>
                        <p className="text-sm mt-2">${ticket.price} | Qty: {ticket.quantity}</p>
                        <button onClick={() => handleDelete(ticket.id)} className="mt-4 bg-red-600 hover:bg-red-700 w-full py-2 rounded-xl text-white">❌ Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Ticket;
