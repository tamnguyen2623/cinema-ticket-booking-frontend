import React from "react";
import { Table, Button, Input, Select, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "../../components/styles/supportStyle.css";
import { handleToggleSupportStatus } from "./SupportActions";

const SupportList = ({
  supports,
  showModal,
  fetchSupports,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  auth,
}) => {
  const columns = [
    { title: "Question", dataIndex: "question", key: "question" },
    { title: "Answer", dataIndex: "answer", key: "answer" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
          className="actionButton editButton"
        >
          Update
        </Button>
      ),
    },
    {
      title: "Disabled",
      key: "disabled",
      render: (record) => (
        <Switch
          checked={record.isDelete}
          className="custom-switch"
          onChange={(checked) =>
            handleToggleSupportStatus(auth, record._id, checked, fetchSupports)
          }
        />
      ),
    },
  ];

  return (
    <div className="supportListContainer">
      <div className="searchFilterContainer">
        <div>
          <Input
            className="searchInput"
            placeholder="Search question"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="filterSelect"
            value={filter}
            onChange={(value) => setFilter(value)}
          >
            <Select.Option value="all">All Types</Select.Option>
            <Select.Option value="Technical">Technical</Select.Option>
            <Select.Option value="Billing">Billing</Select.Option>
            <Select.Option value="General">General</Select.Option>
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null)}
          className="addSupportButton"
        >
          Add Support
        </Button>
      </div>
      <Table columns={columns} dataSource={supports} rowKey="_id" />
    </div>
  );
};
export default SupportList;
