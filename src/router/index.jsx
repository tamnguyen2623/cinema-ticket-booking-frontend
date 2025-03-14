import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../layout/AdminLayout";
import CustomerLayout from "../layout/LayoutCustomer/LayoutCustomer";
import Cinema from "../pages/CinemaCustomer/CinemaCustomer";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Movie from "../pages/MovieV2/Movie";
import Purchase from "../pages/Purchase";
import Register from "../pages/Register";
import Schedule from "../pages/Schedule";
import Search from "../pages/Search";
import Tickets from "../pages/Tickets";
import Ticket from "../pages/TicketPrice/Ticket";
import User from "../pages/User";
import MovieDetail from "../pages/MovieDetail";
import Order from "../pages/Order";
import Dashboard from "../pages/DashboardAnalysis/Dashboard";
import Room from "../pages/Room/Room";
import Seat from "../pages/Seat";
import VoucherPage from "../pages/Voucher/VoucherPage";
import Booking from "../pages/Booking";
import ComboCustomer from "../pages/ComboCustomer/Combo";
import TotalSlide from "../pages/TotalSlide";
import MovieList from "../components/MovieList/MovieList";
import DetailMovie from "../components/DetailMovie/DetailMovie";
import ShowtimePage from "../pages/Showtimes/ShowtimePage";
import MovietypePage from "../pages/MovieType/MovieTypePage";
import ComboPage from "../pages/Combo/ComboPage";
import VoucherCustomerPage from "../pages/VoucherCustomer/VoucherCustomer";
import VerifyOtpRegister from "../pages/VerifyOtpRegister";
import SeatAvailable from "../components/Seat/SeatAvailable[Customer]";
import MovieShowing from "../pages/MovieShowing/MovieShowing";
import MovieShowingCustomer from "../components/MovieList/MovieList";
import BookingTicketCustomer from "../components/Cinema/CinemaPage";
import MyTicket from "../pages/Ticket/MyTicket";
import RolePage from "../pages/Role/RolePage";
import EgiftCustomer from "../pages/EgiftCustomer/egiftcustomer";
import EgiftDetailCustomer from "../pages/EgiftDetailCustomer/egiftdetailcustomer";
import Feedback from "../pages/Feedback";
import BookingAdmin from "../pages/BookingAdmin/BookingAdmin";
import Contact from "../pages/Contact";
import EgiftsAdminPage from "../pages/Egiftsadmin/Egiftsadmin";
import MyTicketDetail from "../pages/Ticket/MyTicketDetail";
import VerifyOtpRegisterGoogle from "../pages/VerifyOtpRegisterGoogle";
import Profile from "../pages/profile/profile";
const ProtectedAdminRoute = ({ element }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token || auth.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const router = createBrowserRouter([
  { path: "/:id", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/VerifyOtpRegister", element: <VerifyOtpRegister /> },
  { path: "/VerifyOtpRegisterGoogle", element: <VerifyOtpRegisterGoogle /> },
  { path: "/movie-detail/:id", element: <MovieDetail /> },
  { path: "/purchase/:id", element: <Purchase /> },

  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <MovieShowingCustomer /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "movie-detail/:id", element: <MovieDetail /> },
      { path: "purchase/:id", element: <Purchase /> },
      { path: "schedule", element: <Schedule /> },
      { path: "booking/:transactionId", element: <Booking /> },
      { path: "booking", element: <Booking /> },
      { path: "movieshowing", element: <MovieShowingCustomer /> },
      { path: "bookingticket", element: <BookingTicketCustomer /> },
      { path: "seatAvailable/:id", element: <SeatAvailable /> },
      { path: "movielist", element: <MovieList /> },
      { path: "movielist/:id", element: <DetailMovie /> },
      { path: "totalslide", element: <TotalSlide /> },
      { path: "myticket/:userId", element: <MyTicket /> },
      { path: "contact", element: <Contact /> },
      { path: "egiftcustomer", element: <EgiftCustomer /> },
      { path: "egiftdetailcustomer/:id", element: <EgiftDetailCustomer /> },
      { path: "myticketdetail/:id", element: <MyTicketDetail /> },
      { path: "combocustomer", element: <ComboCustomer /> },
      // { path: "vouchercustomerpage", element: <VoucherCustomerPage /> },
      { path: "/profile", element: <Profile /> },
      { path: "egiftdetailcustomer/:id", element: <EgiftDetailCustomer /> },
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
      { path: "/admin/ticket/", element: <Tickets /> },
      { path: "/admin/voucher", element: <VoucherPage /> },
      { path: "/admin/movieshowing", element: <MovieShowing /> },
      { path: "/admin/showtime", element: <ShowtimePage /> },
      { path: "/admin/movietype", element: <MovietypePage /> },
      { path: "/admin/combo", element: <ComboPage /> },
      { path: "/admin/feedback", element: <Feedback /> },
      { path: "/admin/role", element: <RolePage /> },
      { path: "/admin/booking", element: <BookingAdmin /> },
      { path: "/admin/egiftadmin", element: <EgiftsAdminPage /> },
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
