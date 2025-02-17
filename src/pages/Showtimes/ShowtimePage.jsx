import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, TimePicker } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import moment from "moment-timezone";
import "./ShowtimePage.css";

const ShowtimePage = () => {
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
            console.error("Lỗi khi tải danh sách giờ chiếu:", error);
        }
    };

    const handleAddShowtime = async () => {
        try {
            const values = await form.validateFields();
            const token = await AsyncStorage.getItem("token");

            // Chuyển đổi giờ chiếu từ múi giờ địa phương sang UTC
            const startTime = values.startTime ? values.startTime.format("YYYY-MM-DD HH:mm:ss") : null;

            // Kiểm tra nếu startTime rỗng hoặc không hợp lệ
            if (!startTime) {
                return toast.error("Error: Showtime is required.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }

            // Chuyển đổi thời gian thành UTC
            const utcStartTime = moment(startTime).tz("UTC").toISOString();
            console.log('startTime trước khi gửi (UTC):', utcStartTime);

            // Kiểm tra nếu thời gian đã có sẵn
            const response = await axios.get(`/showtime`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const existingShowtimes = response.data.data || [];
            const isDuplicate = existingShowtimes.some(
                (showtime) => showtime.startTime === utcStartTime
            );
            if (isDuplicate) {
                return toast.error("Error: Showtime already exists.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }

            // Gửi POST request
            await axios.post(
                `/showtime`,
                { startTime: utcStartTime },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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
            console.error("Lỗi khi thêm giờ chiếu:", error);
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
            const token = await AsyncStorage.getItem("token");

            // Chuyển đổi giá trị startTime thành chuỗi hoặc đối tượng Date
            const startTime = values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null;

            if (!startTime) {
                return toast.error("Error: Showtime is required.", {
                    position: "top-center",
                    autoClose: 2000,
                    pauseOnHover: false,
                });
            }

            // Chuyển đổi thời gian thành UTC
            const utcStartTime = moment(startTime).tz("UTC").toISOString();
            console.log('startTime trước khi gửi (UTC):', utcStartTime);

            // Kiểm tra xem giờ mới có trùng với giờ chiếu khác không
            const response = await axios.get(`/showtime`, {
                headers: { Authorization: `Bearer ${token}` }
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

            // Gửi PUT request
            await axios.put(`/showtime/${currentShowtime._id}`, { startTime: utcStartTime }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
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
            console.error("Lỗi khi cập nhật giờ chiếu:", error);
            toast.error("Error: Unable to update showtime.", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
            });
        }
    };

    const handleDeleteClick = (showtime) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa giờ chiếu "${showtime.startTime}" không?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            okType: "danger",
            onOk: () => handleDelete(showtime._id),
        });
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`/showtime/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            fetchShowtimes();
            toast.success("Delete successfully!", {
                position: "top-center",
                autoClose: 2000,
                pauseOnHover: false,
            });
        } catch (error) {
            console.error("Lỗi khi xóa giờ chiếu:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredShowtimes = showtimes.filter((showtime) =>
        showtime.startTime.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "Giờ Chiếu",
            dataIndex: "startTime",
            key: "startTime",
            width: 300,
            render: (startTime) => moment(startTime).format('HH:mm'), // Extract only the time
        },
        {
            title: "Hành Động",
            key: "action",
            render: (record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => setCurrentShowtime(record) || setModalType("edit")}>
                        Sửa
                    </Button>
                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="content">
            <div className="header">
                <Input placeholder="Tìm theo giờ chiếu..." prefix={<SearchOutlined />} onChange={handleSearch} style={{ width: 300 }} />
                <Button icon={<PlusOutlined />} onClick={() => setModalType("add")}>
                    Thêm Giờ Chiếu
                </Button>
            </div>
            <Table dataSource={filteredShowtimes} columns={columns} rowKey="_id" scroll={{ x: 800 }} />
            <Modal title={modalType === "add" ? "Thêm Giờ Chiếu Mới" : "Chỉnh Sửa Giờ Chiếu"} open={modalType !== null} onCancel={() => setModalType(null)} onOk={modalType === "add" ? handleAddShowtime : handleEditShowtime} okText="Lưu" cancelText="Hủy">
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="startTime"
                        label="Giờ Chiếu"
                        rules={[{ required: true, message: "Vui lòng chọn giờ chiếu!" }]}>
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ShowtimePage;
