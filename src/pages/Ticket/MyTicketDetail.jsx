import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Alert, Tag, Typography, Table } from "antd";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";

const { Title } = Typography;

const MyTicketDetail = () => {
    const { id } = useParams(); // Lấy ticket ID từ URL
    const { auth } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicketDetail = async () => {
            if (!id) {
                setError("Không tìm thấy ID vé.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/booking/booking/ticket/${id}`);
                console.log("API Responsea:", response.data.data); // Kiểm tra dữ liệu từ API

                if (response.data.data) {
                    setTicket(response.data.data);
                } else {
                    setError("Không tìm thấy thông tin vé.");
                }
            } catch (err) {
                setError("Lỗi khi tải chi tiết vé.");
            } finally {
                setLoading(false);
            }
        };

        fetchTicketDetail();
    }, [id]);

    if (loading) return <Spin tip="Đang tải chi tiết vé..." className="w-full flex justify-center" />;
    if (error) return <Alert message={error} type="error" showIcon className="my-4" />;
    if (!ticket) return <Alert message="Không có dữ liệu vé." type="error" showIcon />;
console.log("ticket",ticket);

    

    return (
    <div className="px-4 md:px-8 lg:px-16 m-10">
            <div className="bg-[#ddd4b4] text-center font-bold text-lg py-1 relative mb-5">

                <h3 className="detail"> TICKET DETAIL</h3>
        </div>
            <table className="w-full border-collapse text-left p-4">
                <thead>
                    <tr className="bg-black text-white text-center">
                        <th className="p-4 w-1/6">Movie</th>
                        <th className="p-4 w-1/6">Show Time</th>
                        <th className="p-4 w-1/6">Seat</th>
                        <th className="p-4 w-1/6">Note</th>
                        <th className="p-4 w-1/6">QR Code</th>
                        <th className="p-4 w-1/6">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border border-gray-300 ">
                        <td className="p-4 text-gray-700 font-medium border-r border-gray-400">{ticket.movieName}</td>
                        <td className="p-4 border-r border-gray-400">
                            <strong className="text-black">{ticket.cinema}</strong>
                            <p className="text-gray-600">Cinema {ticket.hall}</p>
                            <p className="text-gray-600">{ticket.date}</p>
                            <p className="text-gray-600">
                                {new Date(ticket.showtime).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                        </td>
                        <td className="p-4 border-r border-gray-400">
                            <strong className="text-black">Standard</strong>
                            <p className="text-gray-600">{ticket.seats.join(", ")}</p>
                            {/* <p className="text-gray-600">{ticket.price.toLocaleString()} $</p> */}
                        </td>
                        <td className="p-4 border-r border-gray-400">
                            <strong className="text-black">Voucher: </strong>
                            <p className="text-gray-600">
                                {ticket.voucherId && ticket.voucherId.code ? ticket.voucherId.code : "No voucher"}
                            </p>
                            {/* <p className="text-gray-600"></p> */}
                            <strong className="text-black">Combo: </strong>

                            <p className="text-gray-600">
                                {Array.isArray(ticket.combo) && ticket.combo.length > 0 ? `${ticket.combo.join(", ")} $` : "No combo"}
                            </p>
                        </td>
                        {/* Cột QR Code */}
                        <td className="p-4 flex flex-col items-center border-r border-gray-400">
                            {ticket.qrCode ? (
                                <img
                                    src={ticket.qrCode}
                                    alt="QR Code"
                                    className="w-30 h-30  border border-gray-300 p-1 rounded"
                                />
                            ) : (
                                <p className="text-gray-500">Chưa có QR</p>
                            )}
                        </td>
                        <td className="p-4 font-semibold text-black  ">{ticket.price.toLocaleString()} $</td>
                    </tr>

                    {/* <tr className="border border-gray-300">
                        <td colSpan="4" className=" p-4 font-semibold text-right">Tổng Cộng</td>
                        <td className="p-4 font-semibold text-black">{ticket.price.toLocaleString()}$</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    );
};

export default MyTicketDetail;
