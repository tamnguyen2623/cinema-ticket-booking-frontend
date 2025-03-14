import React, { useState, useEffect } from "react";
import { Table, Typography, Tag, Spin } from "antd";
import { fetchTicket } from "../../components/api/ticketApi";
import { formatPriceWithColor } from "./formatPrice";
import "../../components/styles/TicketBoard.css";

const { Title } = Typography;

const TicketBoard = ({ token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const ticketData = await fetchTicket(token);
        const processedData = ticketData.map((item) => ({
          ...item,
          weekday_before_12: item.price ?? "N/A",
          weekday_12_17: item.price ? item.price + 2 : "N/A",
          weekday_17_21: item.price ? item.price + 3 : "N/A",
          weekday_after_21: item.price ? item.price + 4 : "N/A",
          weekend_before_12: item.price ? item.price + 5 : "N/A",
          weekend_12_17: item.price ? item.price + 5 : "N/A",
          weekend_17_21: item.price ? item.price + 5 : "N/A",
          weekend_after_21: item.price ? item.price + 5 : "N/A",
        }));

        // Nhóm dữ liệu
        const groupedData = Object.values(
          processedData.reduce((acc, item) => {
            if (!acc[item.roomType]) {
              acc[item.roomType] = {
                key: item.roomType,
                roomType: item.roomType,
                children: [],
              };
            }
            acc[item.roomType].children.push({ ...item, key: item._id });
            return acc;
          }, {})
        );

        setData(groupedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  const columns = [
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Seat Type",
      dataIndex: "seatType",
      key: "seatType",
      render: (text) =>
        text ? <Tag color="green">{text}</Tag> : <Tag color="default">—</Tag>,
    },
    {
      title: "Base Price ($)",
      dataIndex: "price",
      key: "price",
      render: (price) => formatPriceWithColor(price, "base"),
    },
    {
      title: "Monday - Thursday",
      children: [
        {
          title: "Before 12:00",
          dataIndex: "weekday_before_12",
          key: "weekday_before_12",
          render: (price) => formatPriceWithColor(price, "base"),
        },
        {
          title: "12:00 - 17:00 (+$2)",
          dataIndex: "weekday_12_17",
          key: "weekday_12_17",
          render: (price) => formatPriceWithColor(price, "weekday_12_17"),
        },
        {
          title: "17:00 - 21:30 (+$3)",
          dataIndex: "weekday_17_21",
          key: "weekday_17_21",
          render: (price) => formatPriceWithColor(price, "weekday_17_21"),
        },
        {
          title: "After 21:30 (+$4)",
          dataIndex: "weekday_after_21",
          key: "weekday_after_21",
          render: (price) => formatPriceWithColor(price, "weekday_after_21"),
        },
      ],
    },
    {
      title: "Friday - Sunday, Holiday (+$5)",
      children: [
        {
          title: "Before 12:00",
          dataIndex: "weekend_before_12",
          key: "weekend_before_12",
          render: (price) => formatPriceWithColor(price, "weekend"),
        },
        {
          title: "12:00 - 17:00",
          dataIndex: "weekend_12_17",
          key: "weekend_12_17",
          render: (price) => formatPriceWithColor(price, "weekend"),
        },
        {
          title: "17:00 - 21:30",
          dataIndex: "weekend_17_21",
          key: "weekend_17_21",
          render: (price) => formatPriceWithColor(price, "weekend"),
        },
        {
          title: "After 21:30",
          dataIndex: "weekend_after_21",
          key: "weekend_after_21",
          render: (price) => formatPriceWithColor(price, "weekend"),
        },
      ],
    },
  ];

  return (
    <div className="ticket-board">
      <Title level={3} style={{ textAlign: "center" }}>
        Ticket Price Table
      </Title>
      <div className="custom-table-container">
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="key"
            pagination={false}
            bordered
            expandable={{ defaultExpandAllRows: true }}
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
};

export default TicketBoard;
