import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../layout/AdminLayout";
import CustomerLayout from "../layout/LayoutCustomer/LayoutCustomer"
import Cinema from "../pages/Cinema";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Movie from "../pages/Movie";
import Purchase from "../pages/Purchase";
import Register from "../pages/Register";
import Schedule from "../pages/Schedule";
import Search from "../pages/Search";
import Showtime from "../pages/Showtime";
import Tickets from "../pages/Tickets";
import User from "../pages/User";
import MovieDetail from "../pages/MovieDetail";
import Order from "../pages/Order";
import Dashboard from "../pages/Dashboard";
import Room from "../pages/Room";
import Seat from "../pages/Seat";
import VoucherPage from "../pages/Voucher/VoucherPage";
import Booking from "../pages/Booking";
import Ticket from "../pages/Ticket";
import MovieShowing from "../pages/MovieShowing/MovieShowing";
import MovieShowingCustomer from "../components/MovieList/MovieList";
import BookingTicketCustomer from "../components/Cinema/CinemaPage";
const ProtectedAdminRoute = ({ element }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token || auth.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "showtime/:id", element: <Showtime /> },
      { path: "showtime/:id/:code", element: <Showtime /> },
      { path: "movie-detail/:id", element: <MovieDetail /> },
      { path: "purchase/:id", element: <Purchase /> },
      { path: "ticket", element: <Tickets /> },
      { path: "schedule", element: <Schedule /> },
      { path: "booking/:transactionId", element: <Booking /> },
      { path: "booking", element: <Booking /> },
      { path: "movieshowing", element: <MovieShowingCustomer /> },
      { path: "bookingticket", element: <BookingTicketCustomer /> },
    ],
  },

  {
    path: "/",
    element: <ProtectedAdminRoute element={<AdminLayout />} />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/admin/movie", element: <Movie /> },
      { path: "/admin/search", element: <Search /> },
      { path: "/admin/user", element: <User /> },
      { path: "/admin/order", element: <Order /> },
      { path: "/admin/cinema", element: <Cinema /> },
      { path: "/admin/room", element: <Room /> },
      { path: "/admin/seat", element: <Seat /> },
      { path: "/admin/schedule", element: <Schedule /> },
      { path: "/admin/ticketmanagement", element: <Ticket /> },

      { path: "/admin/ticket", element: <Tickets /> },
      { path: "/admin/voucher", element: <VoucherPage /> },
      { path: "/admin/movieshowing", element: <MovieShowing /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => (
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
);

export default AppRouter;
