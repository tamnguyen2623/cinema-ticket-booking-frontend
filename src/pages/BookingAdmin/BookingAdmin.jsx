import React, { useContext, useEffect, useState } from "react";
import { Table, Input, Select, Tag, Space, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import Title from "antd/es/typography/Title";

const { Search } = Input;
const { Option } = Select;

const BookingAdmin = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("/booking/admin/all", {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setBookings(response.data.data);
                setFilteredData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách booking:", error);
                setLoading(false);
            }
        };
        fetchBookings();
    }, [auth.token]);

    useEffect(() => {
        let filtered = bookings;
        if (searchText) {
            filtered = bookings.filter((item) => {
                const movieMatch = item.movieName?.toLowerCase().includes(searchText.toLowerCase());
                const userMatch = item.user?.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item.user?.email?.toLowerCase().includes(searchText.toLowerCase());
                const cinemaMatch = item.cinema?.toLowerCase().includes(searchText.toLowerCase());
                const timeMatch = item.createdAt?.toString().includes(searchText);
                return movieMatch || userMatch || cinemaMatch || timeMatch;
            });
        }
        if (statusFilter) {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }
        setFilteredData(filtered);
    }, [searchText, statusFilter, bookings]);

    const columns = [
        {
            title: "Customer",
            dataIndex: "user",
            key: "user",
            render: (user) => user?.fullname || "N/A",
        },
        {
            title: "Email",
            dataIndex: "user",
            key: "email",
            render: (user) => user?.email || "N/A",
        },
        {
            title: "Movie",
            dataIndex: "movieName",
            key: "movieName",
        },
        {
            title: "Cinema",
            dataIndex: "cinema",
            key: "cinema",
        },
        {
            title: "Seat",
            dataIndex: "seats",
            key: "seats",
            render: (seats) => seats?.join(", ") || "N/A",
        },
        {
            title: "Total",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price?.toLocaleString()} $`,
        },
        {
            title: "Time",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (date ? moment(date).format("DD/MM/YYYY ") : "N/A"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "success" ? "green" :
                        status === "pending" ? "orange" :
                            status === "failed" ? "red" : "gray";
                return <Tag color={color}>{status?.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ textAlign: "center" }}>
                <Title level={3}>List of bookings by customer</Title>
            </div>
            <Space style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search ..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Select
                    placeholder="Filter status"
                    onChange={(value) => setStatusFilter(value)}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="pending">Pending</Option>
                    <Option value="success">Success</Option>
                    <Option value="failed">Failed</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
            </Space>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default BookingAdmin;