import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import MovieShowing from "../pages/MovieShowing/MovieShowing";
import MovieList from '../components/MovieList/MovieList';
import DetailMovie from '../components/DetailMovie/DetailMovie';
import Booking from '../components/Cinema/CinemaPage';



const router = createBrowserRouter([
  
  { path: "/:id", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/showtime/:id", element: <Showtime /> },
  { path: "/showtime/:id/:code", element: <Showtime /> },
  { path: "/movie-detail/:id", element: <MovieDetail /> },
  { path: "/purchase/:id", element: <Purchase /> },
 
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <MovieList/> },
      { path: "movielist", element: <MovieList /> },
      { path: "booking", element: <Booking /> },
      { path: "/movielist/:id", element: <DetailMovie /> },
    ],
  },



  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "movie", element: <Movie /> },
      { path: "search", element: <Search /> },
      { path: "user", element: <User /> },
      { path: "order", element: <Order /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "cinema", element: <Cinema /> },
      { path: "room", element: <Room /> },
      { path: "seat", element: <Seat /> },
      { path: "schedule", element: <Schedule /> },
      { path: "ticket", element: <Tickets /> },
      { path: "voucher", element: <VoucherPage /> },
      { path: "movieshowing", element: <MovieShowing /> }
    ],
  },
]);

const AppRouter = () => (
  <>
    <ToastContainer />
    <RouterProvider router={router} />
  </>
);

export default AppRouter;
