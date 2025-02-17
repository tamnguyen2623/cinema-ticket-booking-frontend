import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
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
import Showtime from "../pages/Showtimes/ShowtimePage";
import Tickets from "../pages/Tickets";
import User from "../pages/User";
import MovieDetail from "../pages/MovieDetail";
import Order from "../pages/Order";
import Dashboard from "../pages/Dashboard";
import Room from "../pages/Room";
import MovieType from "../pages/MovieType/MovieTypePage";
import Combo from "../pages/Combo/ComboPage";
import Ticket from "../pages/Ticket";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/:id", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/cinema", element: <Cinema /> },
  // { path: "/showtime/:id", element: <Showtime /> },
  // { path: "/showtime/:id/:code", element: <Showtime /> },
  { path: "/movie-detail/:id", element: <MovieDetail /> },
  { path: "/purchase/:id", element: <Purchase /> },
  { path: "/ticket", element: <Tickets /> },
  { path: "/schedule", element: <Schedule /> },
  { path: "/movietype", element: <MovieType /> },
  { path: "/combo", element: <Combo /> },
  { path: "/showtime", element: <Showtime /> },

  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "movie", element: <Movie /> },
      { path: "search", element: <Search /> },
      { path: "user", element: <User /> },
      { path: "order", element: <Order /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "room", element: <Room /> },
      { path: "tickets", element: <Ticket /> },
      { path: "movietype", element: <MovieType /> },
      { path: "combo", element: <Combo /> },
      { path: "showtime", element: <Showtime /> },

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
