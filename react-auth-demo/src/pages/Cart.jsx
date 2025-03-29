import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../provider/authProvider";

function Cart() {
    const [cart, setCart] = useState(null);
    const [itemType, setItemType] = useState("book");
    const [availableItems, setAvailableItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    // load or create user's single cart
    useEffect(() => {
        fetchOrCreateCart();
    }, []);

    // re fetch items when itemType changes
    useEffect(() => {
        fetchItemsByType(itemType);
    }, [itemType]);

    const fetchOrCreateCart = async () => {
        try {
            const res = await axios.get("http://localhost:8080/rest/cart");
            const carts = res.data;
            let userCart = carts[0]; // Just one cart per user
            if (!userCart) {
                const newCartRes = await axios.post("http://localhost:8080/rest/cart", { items: [] });
                userCart = newCartRes.data;
            }
            setCart(userCart);
            setLoading(false);
        } catch (err) {
            setError(err.message || "Failed to load or create cart");
            setLoading(false);
        }
    };

    const fetchItemsByType = async (type) => {
        try {
            const res = await axios.get(`http://localhost:8080/rest/${type}`);
            setAvailableItems(res.data);
            setSelectedItemId(res.data.length > 0 ? res.data[0].id : "");
        } catch (err) {
            setAvailableItems([]);
        }
    };


    const handleAddToCart = async () => {
        if (!selectedItemId || !cart?.id) return;
        try {
            const itemRes = await axios.get(`http://localhost:8080/rest/${itemType}/${selectedItemId}`);
            const selected = itemRes.data;

            const newItem = {
                price: selected.price || 0,
                quantity: quantity,
                description: `${itemType.toUpperCase()}: ${selected.title || selected.text || selected.description || "Unknown"}`
            };

            const updatedCart = {
                ...cart,
                items: [...(cart.items || []), newItem]
            };

            await axios.put(`http://localhost:8080/rest/cart/${cart.id}`, updatedCart, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchOrCreateCart();
            setQuantity(1);
        } catch (err) {
            alert("Failed to add item: " + err.message);
        }
    };

    const handleDeleteItem = async (indexToRemove) => {
        const updatedItems = cart.items.filter((_, i) => i !== indexToRemove);
        const updatedCart = { ...cart, items: updatedItems };
        try {
            await axios.put(`http://localhost:8080/rest/cart/${cart.id}`, updatedCart);
            setCart(updatedCart);
        } catch (err) {
            alert("Failed to delete item: " + err.message);
        }
    };

    const total = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

    if (loading) return <div className="text-center text-white mt-20">Loading cart...</div>;
    if (error) return <div className="text-red-600 text-center mt-20">Error: {error}</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-5xl font-semibold text-center text-gray-200 mb-12">🛒 Your Cart</h1>

            {/* ADD ITEM TO CART */}
            <div className="bg-zinc-800 p-6 rounded-xl shadow-md border border-zinc-700 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <select
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value)}
                        className="bg-zinc-700 text-white rounded-xl px-4 py-3"
                    >
                        <option value="book">📚 Book</option>
                        <option value="ticket">🎟️ Ticket</option>
                        <option value="magazine">📰 Magazine</option>
                        <option value="discmag">💿 DiscMag</option>
                    </select>

                    <select
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="bg-zinc-700 text-white rounded-xl px-4 py-3"
                    >
                        {availableItems.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title || item.text || item.description}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="bg-zinc-700 text-white rounded-xl px-4 py-3"
                        placeholder="Qty"
                    />
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl shadow-md"
                >
                    ➕ Add to Cart
                </button>
            </div>

            {/* CART DISPLAY */}
            <div className="space-y-6">
                {cart?.items?.length > 0 ? (
                    cart.items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-zinc-800 text-white p-6 rounded-xl shadow-md border border-zinc-700"
                        >
                            <h2 className="text-xl font-semibold">{item.description}</h2>
                            <p className="text-sm text-zinc-400">
                                💵 ${item.price} × {item.quantity}
                            </p>
                            <p className="mt-1 font-medium text-green-400">
                                Total: ${item.price * item.quantity}
                            </p>
                            <button
                                onClick={() => handleDeleteItem(index)}
                                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl"
                            >
                                ❌ Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-zinc-400 text-center">Your cart is empty.</p>
                )}
            </div>

            {/* TOTAL */}
            <div className="mt-10 text-white text-center text-2xl font-semibold">
                🧮 Total: ${total.toFixed(2)}
            </div>
        </div>
    );
}

export default Cart;
