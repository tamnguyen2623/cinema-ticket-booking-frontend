import React, { useContext, useEffect, useState } from "react";
import { Table, Select, Typography, Layout, Card, Spin } from "antd";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const { Option } = Select;
const { Content } = Layout;

const SupportQuestionCustomer = () => {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    if (filterType === '' || filterType === 'All') {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.type === filterType));
    }
  }, [filterType, questions]);
  
  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/support/support/customer`);
      console.log("API Response:", response);
      const bookingsData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      console.log(bookingsData);

      setQuestions(bookingsData);
      setFilteredQuestions(bookingsData);
    } catch (err) {
      console.error("Lỗi khi tải danh sách câu hỏi.");
      setQuestions([]);
      setFilteredQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading)
    return (
      <Spin
        tip="Đang tải danh sách câu hỏi..."
        className="w-full flex justify-center"
      />
    );

  return (
    <>
      <div className="hot_movies">
        <p className="title-unique">Support Question</p>
      </div>
      <Layout style={{ minHeight: '100vh', padding: '20px', background: '#fff' }}>
      <Content>
        <Select
          value={filterType}
          onChange={handleFilterChange}
          style={{ width: 200, marginBottom: 20 }}
          placeholder="Filter by type"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="Technical">Technical</Option>
          <Option value="Billing">Billing</Option>
          <Option value="General">General</Option>
          <Option value="Cinema">Cinema</Option>
          <Option value="Online">Online</Option>
        </Select>

        {filteredQuestions.map((question) => (
          <Card 
            key={question._id} 
            style={{ 
              marginBottom: 20, 
              backgroundColor: '#dad2b4',
              borderRadius: '10px',
              padding: '15px'
            }}
          >
            <Typography.Title level={4} style={{ marginBottom: 10 }}>
              {question.question}
            </Typography.Title>
            <Typography.Text type="secondary">
              Type: {question.type}
            </Typography.Text>
            <div style={{ marginTop: 10 }}>
              <Typography.Paragraph>
                {question.answer}
              </Typography.Paragraph>
              <div style={{ textAlign: 'right', marginTop: 5 }}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  {moment(question.createdAt).format('YYYY-MM-DD HH:mm')}
                </Typography.Text>
              </div>
            </div>
          </Card>
        ))}
      </Content>
    </Layout>
    </>
  );
};

export default SupportQuestionCustomer;
