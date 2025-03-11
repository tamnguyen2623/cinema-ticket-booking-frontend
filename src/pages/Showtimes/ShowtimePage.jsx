import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Form, Input, DatePicker, Select, Modal, TimePicker,Switch } from 'antd';
import { toast } from "react-toastify";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment-timezone";
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const ShowtimePage = () => {
    const { auth } = useContext(AuthContext);
    const [showtimes, setShowtimes] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [form] = Form.useForm();
    const [currentShowtime, setCurrentShowtime] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchShowtimes();
    }, []);

    useEffect(() => {
        if (modalType === "edit" && currentShowtime) {
            // Chuyển đổi giờ chiếu từ UTC sang giờ địa phương khi chỉnh sửa
            const startTime = moment(currentShowtime.startTime).tz('UTC').local();
            form.setFieldsValue({
                startTime: startTime,
            });
        }
    }, [modalType, currentShowtime, form]);

    const fetchShowtimes = async () => {
        try {
            const response = await axios.get(`/showtime`);
            console.log(response.data); // Log the data to check its structure
            setShowtimes(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error loading showtime list:", error);
        }
    };
    const handleAddShowtime = async () => {
        try {
            const value = await form.validateFields();
            const startTime = value.startTime ? value.startTime.format("YYYY-MM-DD HH:mm:ss") : null;
            if (!startTime) {
                return toast.error("Error: Showtime is required.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }

            const utcStartTime = moment(startTime).tz("UTC").toISOString();
            console.log('startTime trước khi gửi (UTC):', utcStartTime);

            // Kiểm tra showtime có bị trùng không
            const response = await axios.get(`/showtime`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
            });
            const existingShowtimes = response.data.data || [];
            const isDuplicate = existingShowtimes.some(showtime => showtime.startTime === utcStartTime);

            if (isDuplicate) {
                return toast.error("Error: Showtime already exists.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }

            // Thêm showtime mới
            await axios.post(
                `/showtime`,
                { startTime: utcStartTime },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );

            fetchShowtimes();
            setModalType(null);
            form.resetFields();
            toast.success("Created successfully!", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error("Error adding showtime:", error);
            toast.error("Error: Unable to add showtime.", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    const handleEditShowtime = async () => {
        try {
            const values = await form.validateFields();
            const startTime = values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null;

            if (!startTime) {
                return toast.error("Error: Showtime is required.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }
            const utcStartTime = moment(startTime).tz("UTC").toISOString();
            console.log('startTime trước khi gửi (UTC):', utcStartTime);
            const response = await axios.get(`/showtime`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            const existingShowtimes = response.data.data || [];
            const isDuplicate = existingShowtimes.some(showtime =>
                showtime.startTime === utcStartTime && showtime._id !== currentShowtime._id
            );
            if (isDuplicate) {
                return toast.error("Error: Showtime already exists.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }

            await axios.put(`/showtime/${currentShowtime._id}`, { startTime: utcStartTime }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`
                }
            });

            fetchShowtimes();
            setModalType(null);
            toast.success("Update successfully!", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error("Error updating showtimes:", error);
            toast.error("Error: Unable to update showtime.", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };
    const handleDisable = async (id, isDelete) => {
        try {
            await axios.put(`/showtime/updateIsDelete/${id}`, { isDelete: !isDelete }, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }
            });
            fetchShowtimes();
            toast.success("Showtime status updated successfully!");
        } catch (error) {
            console.error("Error updating showtime status:", error);
            toast.error("Failed to update showtime status!");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredShowtimes = showtimes
        .map((showtime) => ({
            ...showtime,
            formattedTime: moment(showtime.startTime).format('HH:mm') // Chuyển về HH:mm để tìm kiếm
        }))
        .filter((showtime) => showtime.formattedTime.includes(searchTerm)) // Lọc theo HH:mm
        .sort((a, b) => moment(a.formattedTime, "HH:mm") - moment(b.formattedTime, "HH:mm"));


    const columns = [
        {
            title: "Showtime",
            dataIndex: "startTime",
            key: "startTime",
            width: 300,
            render: (startTime) => moment(startTime).format('HH:mm'), // Extract only the time
            sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(), // Sắp xếp trực tiếp trên bảng

        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        className="custom-edit-btn"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            form.setFieldsValue({ startTime: moment(record.startTime) });
                            setCurrentShowtime(record);
                            setModalType("edit");
                        }}
                    >
                        Update
                    </Button>
                </div>
            ),
        },
        {
            title: "Disabled",
            key: "disabled",
            render: (record) => (
                <Switch
                    checked={record.isDelete}
                    className="custom-switch"
                    onChange={() => handleDisable(record._id, record.isDelete)}
                />
            ),
        },
    ];

    return (
        <div className='content'>
            <div style={{ display: "flex", gap: "10px", marginBottom: 16 }}>
                <Input placeholder="Search by showtime..."
                    prefix={<SearchOutlined />}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => setModalType("add")}
                >
                    Add Showtime
                </Button>
            </div>
            <Table
                dataSource={filteredShowtimes}
                columns={columns}
                rowKey="_id"
                scroll={{ x: 800 }}
            />
            <Modal
                okButtonProps={{ className: "custom-ok-btn" }}
                title={modalType === "add" ? "Add New Showtimes" : "Edit Show Time"}
                open={modalType !== null}
                onCancel={() => setModalType(null)}
                onOk={modalType === "add" ? handleAddShowtime : handleEditShowtime}
                okText="Save"
                cancelText="Cancel">
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="startTime"
                        label="Showtime"
                        rules={[{ required: true, message: "Please select showtime!" }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ShowtimePage;