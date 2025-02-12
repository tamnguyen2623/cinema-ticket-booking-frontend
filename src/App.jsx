import axios from "axios";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./AdminRoute";
import Cinema from "./pages/Cinema";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Movie from "./pages/Movie";
import Purchase from "./pages/Purchase";
import Register from "./pages/Register";
import Schedule from "./pages/Schedule";
import Search from "./pages/Search";
import Showtime from "./pages/Showtime";
import Tickets from "./pages/Tickets";
import User from "./pages/User";
import MovieDetail from "./pages/MovieDetail";
import Order from "./pages/Order";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
axios.defaults.baseURL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cinema" element={<Cinema />} />
        <Route
          path="/movie"
          element={
            <AdminRoute>
              <Movie />
            </AdminRoute>
          }
        />
        <Route
          path="/search"
          element={
            <AdminRoute>
              <Search />
            </AdminRoute>
          }
        />
        <Route path="/showtime/:id" element={<Showtime />} />
        <Route path="/showtime/:id/:code" element={<Showtime />} />
        <Route path="/movie-detail/:id" element={<MovieDetail />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/ticket" element={<Tickets />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route
          path="/user"
          element={
            <AdminRoute>
              <User />
            </AdminRoute>
          }
        />
        <Route
          path="/order"
          element={
            <AdminRoute>
              <Order />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/room"
          element={
            <AdminRoute>
              <Room />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
