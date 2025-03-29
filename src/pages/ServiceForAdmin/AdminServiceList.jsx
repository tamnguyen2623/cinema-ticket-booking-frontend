import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Table, Button, Form, Input, Modal, Select } from "antd";
const AdminServiceList = () => {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState(""); // State lưu thứ tự sắp xếp

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`/service`);
            setServices(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error("Error loading admin services:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSortChange = (value) => {
        setSortOrder(value);
    };
    const filteredServices = services.filter((service) =>
        service.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedServices = [...filteredServices].sort((a, b) => {
        if (sortOrder === "asc") return a.fullName.localeCompare(b.fullName);
        if (sortOrder === "desc") return b.fullName.localeCompare(a.fullName);
        return 0; // Không sắp xếp nếu không có lựa chọn
    });
    const columns = [
        { title: "Cinema Name", dataIndex: "cinemaName", key: "cinemaName" },
        { title: "Full Name", dataIndex: "fullName", key: "fullName" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Service", dataIndex: "service", key: "service" },
        { title: "Information", dataIndex: "information", key: "information" },
    ];

    return (
        <div className="container-fluid">
            <div className="title-ticket">Service</div>
            <div className="ticketListContainer">
                <div className="searchFilterContainer">
                    <Input
                        placeholder="Search by full name..."
                        onChange={handleSearch}
                        className="searchInput"
                        style={{ width: 300 }}
                    />
                    <Select
                        placeholder="Sort by"
                        value={sortOrder}
                        onChange={handleSortChange}
                        className="filterSelect"
                    >
                        <Option value="">Default</Option>
                        <Option value="asc">A - Z</Option>
                        <Option value="desc">Z - A</Option>
                    </Select>
                </div>
                <Table dataSource={sortedServices} columns={columns} rowKey="_id" />
            </div>
        </div>
    );
};

export default AdminServiceList;
