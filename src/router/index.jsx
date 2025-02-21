import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../layout/AdminLayout";
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


const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/:id", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // { path: "/cinema", element: <Cinema /> },
  { path: "/showtime/:id", element: <Showtime /> },
  { path: "/showtime/:id/:code", element: <Showtime /> },
  { path: "/movie-detail/:id", element: <MovieDetail /> },
  { path: "/purchase/:id", element: <Purchase /> },
  // { path: "/ticket", element: <Tickets /> },
  // { path: "/schedule", element: <Schedule /> },
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
      { path: "movieshowing", element: <MovieShowing/>}
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
