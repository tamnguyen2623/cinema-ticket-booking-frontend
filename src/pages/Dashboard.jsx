import {
  UserIcon,
  FilmIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { AnalyticsCurrentVisits } from "../components/AnalysisCircle";
import { ApexColumnChart } from "../components/chart/column-chart";
import { ApexBarChart } from "../components/chart/bar-chart";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cinemaAnalysis, setCinemaAnalysis] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [year, setYear] = useState("2025");

  const fetchTotalUsers = async (data) => {
    try {
      // setIsFetchingShowtimesDone(false)
      const response = await axios.get("/auth/user/total", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTotalUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTotalMovies = async (data) => {
    try {
      // setIsFetchingShowtimesDone(false)
      const response = await axios.get("/movie/total", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTotalMovies(response.data.data.totalMovies);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTotalOrders = async (data) => {
    try {
      // setIsFetchingShowtimesDone(false)
      const response = await axios.get("/order/total", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTotalOrders(response.data.data.totalOrders);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTotalRevenue = async (data) => {
    try {
      // setIsFetchingShowtimesDone(false)
      const response = await axios.get("/order/revenue", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTotalRevenue(response.data.data.totalRevenue);
    } catch (error) {
      console.error(error);
    }
  };
  const analyzeCinema = async (data) => {
    try {
      // setIsFetchingShowtimesDone(false)
      const response = await axios.get("/order/revenue-by-cinema", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setCinemaAnalysis(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getTotalRevenueByMonth = async (year) => {
    try {
      const response = await axios.get("/order/revenue-by-month?year=" + year, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response.data)
      setRevenueByMonth(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getTotalRevenueByMovie = async (year) => {
    try {
      const response = await axios.get("/order/revenue-by-movie", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRevenueByMovie(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          totalUsers,
          totalMovies,
          totalOrders,
          totalRevenue,
          cinemaAnalysis,
          revenueByMonth,
          revenueByMovie,
        ] = await Promise.all([
          fetchTotalUsers(),
          fetchTotalMovies(),
          fetchTotalOrders(),
          fetchTotalRevenue(),
          analyzeCinema(),
          getTotalRevenueByMonth(year),
          getTotalRevenueByMovie(),
        ]);

        console.log("All data loaded successfully!");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, [year]);

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      {/* <Navbar /> */}
      <div className="mx-4 flex h-fit flex-col gap-6 rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-6 drop-shadow-xl sm:mx-8 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            onClick={() => (window.location.pathname = "/user")}
            className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105"
          >
            <UserIcon className="h-12 w-12 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-700">
              Total Users
            </span>
            <span className="text-4xl font-bold text-indigo-900">
              {formatNumber(totalUsers)}
            </span>
          </div>
          <div
            onClick={() => (window.location.pathname = "/movie")}
            className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105"
          >
            <FilmIcon className="h-12 w-12 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-700">
              Total Movies
            </span>
            <span className="text-4xl font-bold text-indigo-900">
              {formatNumber(totalMovies)}
            </span>
          </div>
          <div
            onClick={() => (window.location.pathname = "/order")}
            className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105"
          >
            <ShoppingCartIcon className="h-12 w-12 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-700">
              Total Orders
            </span>
            <span className="text-4xl font-bold text-indigo-900">
              {formatNumber(totalOrders)}
            </span>
          </div>
          <div
            onClick={() => (window.location.pathname = "/order")}
            className="flex flex-col items-center gap-3 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105"
          >
            <CurrencyDollarIcon className="h-12 w-12 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-700">
              Total Revenue
            </span>
            <span className="text-4xl font-bold text-indigo-900">
              {formatNumber(totalRevenue)} VND
            </span>
          </div>
        </div>
      </div>
      <div className="mx-4 flex h-fit flex-col gap-6 rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-6 drop-shadow-xl sm:mx-8 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-900">Analysis</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105">
            <span
              style={{
                fontWeight: 400,
                fontSize: "1.5rem",
                lineHeight: 1.334,
                textAlign: "center",
              }}
            >
              Revenue By Cinema
            </span>
            <AnalyticsCurrentVisits
              // title="Revenue By Cinema"
              chart={{
                series: cinemaAnalysis || [{ label: "ABC", value: 1 }],
              }}
            />
            {/* <ApexColumnChart data={[1,2,3,5]} categories={["", "b", "c", "d"]}  /> */}
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105">
            <span
              style={{
                fontWeight: 400,
                fontSize: "1.5rem",
                lineHeight: 1.334,
                textAlign: "center",
              }}
            >
              Revenue By Movie
            </span>
            {revenueByMovie.totalRevenue && revenueByMovie.totalRevenue.length > 0 && (
              <ApexBarChart
                data={revenueByMovie.totalRevenue || []}
                categories={revenueByMovie.categories || []}
              />
            )}

            {/* <ApexColumnChart data={[1,2,3,5]} categories={["", "b", "c", "d"]}  /> */}
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-white p-6 drop-shadow-md transition-transform transform hover:scale-105">
            <span
              style={{
                fontWeight: 400,
                fontSize: "1.5rem",
                lineHeight: 1.334,
                textAlign: "center",
              }}
            >
              Revenue By Month
            </span>
            {revenueByMonth && revenueByMonth.length > 0 && (
              <ApexColumnChart
                data={revenueByMonth || []}
                categories={[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
