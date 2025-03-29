import React, { useState } from "react";
import { Table, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const AdminServiceList = () => {
  const [services, setServices] = useState([
    {
      _id: "1",
      cinemaName: "CGV Vincom",
      fullName: "Nguyễn Văn A",
      phoneNumber: "0987654321",
      email: "nguyenvana@example.com",
      service: "Ticket Booking",
      information: "Đã đặt vé cho buổi diễn lúc 19:00",
    },
    {
      _id: "2",
      cinemaName: "Lotte Cinema",
      fullName: "Trần Thị B",
      phoneNumber: "0912345678",
      email: "tranthib@example.com",
      service: "Refund Request",
      information: "Yêu cầu hoàn lại tiền do xung đột lịch trình",
    },
    {
      _id: "3",
      cinemaName: "Galaxy Nguyễn Du",
      fullName: "Lê Văn C",
      phoneNumber: "0908765432",
      email: "levanc@example.com",
      service: "Seat Upgrade",
      information: "Cần hỗ trợ để nâng cấp lên ghế VIP",
    },
  ]);

  const handleDelete = (id) => {
    setServices(services.filter((service) => service._id !== id));
    message.success("Service deleted successfully!");
  };

  const columns = [
    {
      title: "Cinema Name",
      dataIndex: "cinemaName",
      key: "cinemaName",
      align: "left",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      align: "left",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      align: "left",
    },
    {
      title: "Information Of Service",
      dataIndex: "information",
      key: "information",
      align: "left",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button 
        style={{ backgroundColor: "red", borderColor: "red", color: "white" }} 
        onClick={() => handleDelete(record._id)} 
        icon={<DeleteOutlined />}
      >
        Delete
      </Button>      
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div className="title-ticket">Service List</div>
      <div className="ticketListContainer">
        <Table 
          columns={columns} 
          dataSource={services} 
          rowKey="_id" 
          pagination={{ pageSize: 5 }} 
        />
      </div>
    </div>
  );
};

export default AdminServiceList;
