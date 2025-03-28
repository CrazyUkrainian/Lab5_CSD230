import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
            <div className="text-2xl font-bold tracking-wide">  APP NAV</div>
            <div className="flex space-x-8 text-lg font-medium">
                <Link to="/book" className="hover:text-blue-400 transition">    Books</Link>
                <Link to="/ticket" className="hover:text-blue-400 transition">      Tickets</Link>
                <Link to="/magazine" className="hover:text-blue-400 transition">      Magazines</Link>
                <Link to="/discmag" className="hover:text-blue-400 transition">     DiscMags</Link>
                <Link to="/cart" className="hover:text-blue-400 transition">    Cart</Link>
                <Link to="/logout" className="hover:text-red-500 transition">    Logout</Link>
            </div>
        </nav>
    );
}

export default Navbar;
