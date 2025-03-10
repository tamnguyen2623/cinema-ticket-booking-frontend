import React, { useState, useEffect } from "react";
import { Table, Switch } from "antd";
import { getAll, filterFeedback, updateFeedback } from "../api/feedback";
import { toast } from "react-toastify";
import "./Feedback.css";

export default function FeedbackFilter({ selectedTypes }) {
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      if (selectedTypes === "All") {
        const data = await getAll();
        setFilteredFeedbacks(data);
      } else {
        const data = await filterFeedback(selectedTypes);
        console.log(Array.isArray(data));
        setFilteredFeedbacks(data);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [selectedTypes]);

  const handleDisabled = async (id, isDelete) => {
    try {
      await updateFeedback(id, { isDelete: !isDelete });
      fetchFeedbacks();
      toast.success("Update status successfully!");
    } catch (error) {
      console.error("Error disabled feedback:", error);
      toast.error("Failed to update status!");
    }
  };

  return (
    <Table
      dataSource={filteredFeedbacks} // Hiển thị danh sách đã lọc
      rowKey="_id"
      pagination={{ pageSize: 7, showSizeChanger: false }}
      columns={[
        {
          title: "Customer",
          dataIndex: "userId",
          render: (user) => user?.fullname,
        },
        {
          title: "Ratting",
          dataIndex: "ratting",
          render: (ratting) => (
            <div className="feedback__star-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`feedback__star ${star <= ratting ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
          ),
        },
        {
          title: "Comment",
          dataIndex: "comment",
        },
        {
          title: "Date",
          dataIndex: "date",
        },
        {
          title: "Movie",
          dataIndex: "movieId",
          render: (movie) => movie?.name,
        },
        {
          title: "Disabled",
          render: (record) => (
            <div style={{ display: "flex", gap: "10px" }}>
              <Switch
                checked={record.isDelete}
                className="custom-switch"
                onChange={() => handleDisabled(record._id, record.isDelete)}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
