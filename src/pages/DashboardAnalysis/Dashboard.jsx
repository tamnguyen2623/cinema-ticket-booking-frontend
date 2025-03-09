import {
  UserIcon,
  FilmIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { AnalyticsCurrentVisits } from "../../components/AnalysisCircle";
import { ApexColumnChart } from "../../components/chart/column-chart";
import { ApexBarChart } from "../../components/chart/bar-chart";
import { ApexLineChart } from "../../components/chart/line-chart";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cinemaAnalysis, setCinemaAnalysis] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [revenueByNewCustomers, setRevenueByNewCustomers] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [yearForByMonth, setYearForByMonth] = useState("2025");
  const [yearForByDay, setYearForByDay] = useState("2025");
  const [month, setMonth] = useState("3");

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
      console.log(response.data);
      setRevenueByMonth(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getTotalRevenueByMovie = async () => {
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

  const getTotalRevenueByNewCustomers = async () => {
    try {
      const response = await axios.get("/revenue/revenue-by-new-customers", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRevenueByNewCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalRevenueByDay = async (month, year) => {
    try {
      const response = await axios.get(
        "/revenue/revenue-by-day?month=" + month + "&year=" + year,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setRevenueByDay(response.data);
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
          revenueByMovie,
          revenueByNewCustomers,
        ] = await Promise.all([
          fetchTotalUsers(),
          fetchTotalMovies(),
          fetchTotalOrders(),
          fetchTotalRevenue(),
          analyzeCinema(),
          getTotalRevenueByMovie(),
          getTotalRevenueByNewCustomers(),
        ]);

        console.log("All data loaded successfully!");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, []);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [revenueByMonth] = await Promise.all([
          getTotalRevenueByMonth(yearForByMonth),
        ]);

        console.log("All data loaded successfully!");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, [yearForByMonth]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [revenueByDay] = await Promise.all([
          getTotalRevenueByDay(month, yearForByDay),
        ]);

        console.log("All data loaded successfully!");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, [yearForByDay, month]);

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-gray-100 p-6 sm:p-10">
      <div className="mx-auto w-full max-w-7xl rounded-lg bg-white p-8 shadow-lg sm:p-10">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: UserIcon,
              label: "Total Users",
              value: totalUsers,
              path: "/user",
            },
            {
              icon: FilmIcon,
              label: "Total Movies",
              value: totalMovies,
              path: "/movie",
            },
            {
              icon: ShoppingCartIcon,
              label: "Total Orders",
              value: totalOrders,
              path: "/order",
            },
            {
              icon: CurrencyDollarIcon,
              label: "Total Revenue",
              value: `${formatNumber(totalRevenue)} $`,
              path: "/order",
            },
          ].map(({ icon: Icon, label, value, path }, index) => (
            <div
              key={index}
              onClick={() => (window.location.pathname = path)}
              className="flex cursor-pointer flex-col items-center gap-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Icon className="h-14 w-14 text-white" />
              <span className="text-lg font-medium">{label}</span>
              <span className="text-3xl font-bold">{formatNumber(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl rounded-lg bg-white p-8 shadow-lg sm:p-10">
        <h2 className="text-3xl font-bold text-gray-800">Analysis</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Revenue By Cinema",
              component: (
                <AnalyticsCurrentVisits
                  chart={{
                    series: cinemaAnalysis || [{ label: "ABC", value: 1 }],
                  }}
                />
              ),
            },
            {
              title: "Revenue By Movie",
              component: revenueByMovie.totalRevenue?.length > 0 && (
                <ApexBarChart
                  data={revenueByMovie.totalRevenue}
                  categories={revenueByMovie.categories}
                />
              ),
            },
            {
              title: "Revenue By Month",
              component: revenueByMonth?.length > 0 && (
                <ApexColumnChart
                  data={revenueByMonth}
                  categories={[...Array(12).keys()].map((n) =>
                    (n + 1).toString()
                  )}
                />
              ),
            },
          ].map(({ title, component }, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="text-xl font-semibold text-gray-800">
                {title}
              </span>
              {component}
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {[
            {
              title: "Revenue By New Customers",
              component: (
                <AnalyticsCurrentVisits
                  chart={{
                    series: revenueByNewCustomers || [{ label: "ABC", value: 1 }],
                  }}
                />
              ),
            },
            {
              title: "Revenue By Day",
              component: revenueByDay && (
                <ApexLineChart
                  data={revenueByDay.totalRevenueByDay}
                  categories={revenueByDay.days}
                />
              ),
            },
          ].map(({ title, component }, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="text-xl font-semibold text-gray-800">
                {title}
              </span>
              {component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
