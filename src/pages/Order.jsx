import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import ShowtimeDetails from "../components/ShowtimeDetails";
import { AuthContext } from "../context/AuthContext";

const Order = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState(null);
  const [ticketsUser, setTicketsUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isUpdating, SetIsUpdating] = useState(false);
  const [isDeleting, SetIsDeleting] = useState(false);
  const [filterdOrders, setFilteredOrders] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const fetchOrders = async (data) => {
    try {
      // setIsFetchingShowtimesDone(false)
      const response = await axios.get("/admin/orders", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response.data.data);
      setOrders(
        response.data.data?.sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return -1;
        })
      );
      setFilteredOrders(
        response.data.data?.sort((a, b) => {
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return -1;
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      // setIsFetchingShowtimesDone(true)
    }
  };

  function formatDateToUTC7(dateString) {
    const date = new Date(dateString);

    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    const hours = String(adjustedDate.getUTCHours()).padStart(2, "0");
    const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, "0");
    const day = String(adjustedDate.getUTCDate()).padStart(2, "0");
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
    const year = adjustedDate.getUTCFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }

  useEffect(() => {
    fetchOrders();
  }, []);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const UTC_OFFSET = 7 * 60 * 60 * 1000; // Offset for UTC+7 in milliseconds

    if (startDate !== "" && endDate === "") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            new Date(order.createdAt).getTime() >=
            Date.UTC(
              new Date(startDate).getFullYear(),
              new Date(startDate).getMonth(),
              new Date(startDate).getDate()
            ) -
            UTC_OFFSET
        )
      );
    } else if (startDate === "" && endDate !== "") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            new Date(order.createdAt).getTime() <=
            Date.UTC(
              new Date(endDate).getFullYear(),
              new Date(endDate).getMonth(),
              new Date(endDate).getDate()
            ) +
            24 * 60 * 60 * 1000 -
            UTC_OFFSET
        )
      );
    } else if (startDate !== "" && endDate !== "") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            new Date(order.createdAt).getTime() >=
            Date.UTC(
              new Date(startDate).getFullYear(),
              new Date(startDate).getMonth(),
              new Date(startDate).getDate()
            ) -
            UTC_OFFSET &&
            new Date(order.createdAt).getTime() <=
            Date.UTC(
              new Date(endDate).getFullYear(),
              new Date(endDate).getMonth(),
              new Date(endDate).getDate()
            ) +
            24 * 60 * 60 * 1000 -
            UTC_OFFSET
        )
      );
    }
  }, [startDate, endDate, orders]);

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `/order/export?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${auth.token}`,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = "orders.xlsx";
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
  function formatDateToUTC7NoSec(dateString) {
    const date = new Date(dateString);

    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    const hours = String(adjustedDate.getUTCHours()).padStart(2, "0");
    const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, "0");
    const day = String(adjustedDate.getUTCDate()).padStart(2, "0");
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
    const year = adjustedDate.getUTCFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <Navbar />
      <div className="mx-4 flex h-fit flex-col gap-2 rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
        <div className="flex gap-4 items-center mb-4">
          <label className="flex flex-col text-gray-900 font-semibold">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col text-gray-900 font-semibold">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col text-gray-900 font-semibold">
            Export:
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-700 transition duration-200"
            >
              Export File
            </button>
          </label>
        </div>

        <div className="relative drop-shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
          </div>
          <input
            type="search"
            className="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-gray-900"
            placeholder="Search order by user's email"
            {...register("search")}
          />
        </div>
        <div
          className={`mt-2 grid max-h-[60vh] overflow-auto rounded-md bg-gradient-to-br from-indigo-100 to-white`}
          style={{
            gridTemplateColumns:
              "repeat(9, minmax(max-content, 1fr)) max-content max-content",
          }}
        >
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Fullname
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Email
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Cinema
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Theater
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Movie
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Seat
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Showtime
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Total Price
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Date
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Method
          </p>
          <p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">
            Status
          </p>
          {filterdOrders
            ?.filter((order) =>
              order.user.email
                .toLowerCase()
                .includes(watch("search")?.toLowerCase() || "")
            )
            .map((order, index) => {
              return (
                <Fragment key={index}>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.user.fullname}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.user.email}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.showtime.theater.cinema.name}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.showtime.theater.number}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.showtime.movie.name}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.seats
                      .map((seat) => seat.row + seat.number)
                      .join(", ")}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {formatDateToUTC7NoSec(order.showtime.showtime)}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.price} VND
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {formatDateToUTC7(order.createdAt)}
                  </div>
                  <div className="border-t-2 border-indigo-200 px-2 py-1">
                    {order.method}
                  </div>
                  <div
                    style={
                      order.status === "done"
                        ? { color: "green" }
                        : order.status === "pending"
                          ? { color: "black" }
                          : { color: "red" }
                    }
                    className="border-t-2 border-indigo-200 px-2 py-1"
                  >
                    {order.status}
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Order;
