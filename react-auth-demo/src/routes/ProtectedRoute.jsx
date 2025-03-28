import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import Navbar from "../pages/Navbar"; // ✅ import your Navbar component

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Redirect if not logged in
  if (!token) return <Navigate to="/login" />;

  // Render the nav + child routes
  return (
      <>
        <Navbar />     {/* Show Navbar on all protected pages */}
        <Outlet />     {/* This renders the actual page (Book, Ticket, etc.) */}
      </>
  );
};
