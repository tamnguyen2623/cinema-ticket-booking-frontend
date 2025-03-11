import React, { useState } from "react";
import FeedbackFilter from "../components/Feedback/FeedbackFilter";
import FeedbackTable from "../components/Feedback/FeedbackTable";
import { Typography } from "antd";
const { Title } = Typography;

export default function Feedback() {
  const [selectedTypes, setSelectedTypes] = useState("All");

  // Hàm cập nhật bộ lọc
  const handleFilterChange = (selectedValues) => {
    setSelectedTypes(selectedValues);
  };

  return (
    <div className="p-8">
      <Title>List of feedbacks</Title>
      <div style={{ marginBottom: 16 }}>
        <FeedbackFilter onFilterChange={handleFilterChange} />
      </div>
      <FeedbackTable selectedTypes={selectedTypes} />
    </div>
  );
}
