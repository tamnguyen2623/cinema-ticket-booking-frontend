import {
  UserIcon,
  FilmIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { Select, Button } from "antd";

import { FaFileExport } from 'react-icons/fa';
const { Option } = Select;
import axios from "axios";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { AnalyticsCurrentVisits } from "../../components/AnalysisCircle";
import { ApexColumnChart } from "../../components/chart/column-chart";
import { ApexBarChart } from "../../components/chart/bar-chart";
import { ApexLineChart } from "../../components/chart/line-chart";
import { set } from "react-hook-form";

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [cinemaAnalysis, setCinemaAnalysis] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [revenueByNewCustomers, setRevenueByNewCustomers] = useState(null);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [yearForByMonth, setYearForByMonth] = useState("2025");
  const [yearForByDay, setYearForByDay] = useState("2025");
  const [month, setMonth] = useState("3");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const monthList = Array.from({ length: 12 }, (_, i) => i + 1);

  // Danh sách năm từ 2000 đến năm hiện tại + 10
  const currentYear = new Date().getFullYear();
  const yearList = Array.from({ length: 30 }, (_, i) => currentYear - 15 + i);

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
          revenueByDay,
        ] = await Promise.all([
          fetchTotalUsers(),
          fetchTotalMovies(),
          fetchTotalOrders(),
          fetchTotalRevenue(),
          analyzeCinema(),
          getTotalRevenueByMovie(),
          getTotalRevenueByNewCustomers(),
          getTotalRevenueByDay(month, yearForByDay),
        ]);

        console.log("All data loaded successfully!");
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchAllData();
  }, [yearForByDay, month]);

  useEffect(() => {
    console.log("Fetching data for:", { month, yearForByDay });
    getTotalRevenueByDay(month, yearForByDay);
  }, [month, yearForByDay]);


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
  const handleExport = async (type) => {
    let apiUrl = "";
    let fileName = "export.xlsx";

    switch (type) {
      case "cinema":
        apiUrl = "/order/exportTotalRevenueByCinema";
        fileName = "revenue_by_cinema.xlsx";
        break;
      case "movie":
        apiUrl = "/order/exportTotalRevenueByMovie";
        fileName = "revenue_by_movie.xlsx";
        break;
      case "day":
        apiUrl = "/order/exportRevenueByDay";
        fileName = "revenue_by_day.xlsx";
        break;
      case "month":
        apiUrl = "/order/exportTotalRevenueByMonth";
        fileName = "revenue_by_month.xlsx";
        break;
      case "newuser":
        apiUrl = "/user/exportNewCustomers";
        fileName = "revenue_by_newCustomer.xlsx";
        break;
      case "totalticket":
        apiUrl = "/order/exportTotalTicketsRevenue";
        fileName = "revenue_by_ticket.xlsx";
        break;
      default:
        console.error("Invalid export type");
        return;
    }

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: `Bearer ${auth.token}`,
        },
        responseType: "blob",
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download file:", response);
      }
    } catch (error) {
      console.error("Error exporting orders:", error);
    }
  };

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
        <div className="relative flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Analysis</h2>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="relative flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              <FaFileExport />
              Export File ▼
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-300 z-50">
                <button
                  onClick={() => handleExport("cinema")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export Revenue By Cinema
                </button>
                <button
                  onClick={() => handleExport("movie")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export Revenue By Movie
                </button>
                <button
                  onClick={() => handleExport("day")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export Revenue By Day
                </button>
                <button
                  onClick={() => handleExport("month")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export Revenue By Month
                </button>
                <button
                  onClick={() => handleExport("newuser")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export Revenue By New Customer
                </button>
                <button
                  onClick={() => handleExport("totalticket")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export Revenue By Total Ticket
                </button>
              </div>
            )}
          </div>
        </div>

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
                    series: revenueByNewCustomers || [
                      { label: "ABC", value: 1 },
                    ],
                  }}
                />
              ),
            },
            {
              title: "Revenue By Day",
              component: revenueByDay != null &&
                revenueByDay.days?.length > 0 && (
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
                {title} {index == 1 && (
                  <>
                    <Select
                      value={month}
                      onChange={(e) => setMonth(e)}
                      className="w-24"
                      placeholder="Select Month"
                    >
                      {monthList.map((m) => (
                        <Option key={m} value={m}>
                          {m}
                        </Option>
                      ))}
                    </Select>

                    {/* Chọn Năm */}
                    <Select
                      value={yearForByDay}
                      onChange={(e) => setYearForByDay(e)}
                      className="w-28"
                      placeholder="Select Year"
                    >
                      {yearList.map((y) => (
                        <Option key={y} value={y}>
                          {y}
                        </Option>
                      ))}
                    </Select>
                  </>
                )}
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
