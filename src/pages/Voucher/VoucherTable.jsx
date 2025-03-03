import React from "react";
import { Table, Tag, Button, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";

const VoucherTable = ({ vouchers, handleEditClick, handleToggleDelete }) => {
  const columns = [
    {
      title: "Voucher Code",
      dataIndex: "code",
      key: "code",
      width: 300,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => (typeof discount === "number" ? `${discount}%` : "N/A"),
      width: 250,
    },
    {
      title: "Expiration Date",
      dataIndex: "expiredDate",
      key: "expiredDate",
      render: (date) => (date ? new Date(date).toLocaleDateString("en-US") : "N/A"),
      width: 300,
    },
    {
      title: "Status",
      dataIndex: "isUsed",
      key: "isUsed",
      filters: [
        { text: "Used", value: true },
        { text: "Not Used", value: false },
      ],
      onFilter: (value, record) => record.isUsed === value,
      render: (isUsed) =>
        isUsed ? <Tag color="red">Used</Tag> : <Tag color="green">Not Used</Tag>,
      width: 200,
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Button type="primary" icon={<EditOutlined />}  className="custom-edit-btn" onClick={() => handleEditClick(record)}>
          Edit
        </Button>
      )
    },
    {
      title: "Disabled",
      key: "action",
      render: (record) => (
        <Switch
          checked={record.isDelete}
          onChange={() => handleToggleDelete(record._id, record.isDelete)}
        />
      ),
    },
  ];

  return <Table dataSource={vouchers} columns={columns} rowKey="_id" />;
};

export default VoucherTable;
