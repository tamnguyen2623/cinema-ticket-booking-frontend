import React, { useState, useEffect, useContext } from "react";
import { Form } from "antd";
import { AuthContext } from "../../context/AuthContext";
import SupportList from "./SupportList";
import SupportForm from "./SupportForm";
import {
  fetchSupports,
  handleCreateOrUpdateSupport,
  handleDeleteSupport,
} from "./SupportActions";

const Support = () => {
  const { auth } = useContext(AuthContext);
  const [supports, setSupports] = useState([]);
  const [filteredSupports, setFilteredSupports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupport, setEditingSupport] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (auth?.token) {
      fetchSupports(auth, setSupports, setFilteredSupports, searchTerm, filter);
    }
  }, [auth, searchTerm, filter]);

  const showModal = (support = null) => {
    setEditingSupport(support);
    setIsModalVisible(true);
    if (support) {
      form.setFieldsValue(support);
    } else {
      form.resetFields();
    }
  };

  return (
    <div className="container-fluid">
      <strong className="title-ticket">Supports list</strong>
      <SupportForm
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={() =>
          handleCreateOrUpdateSupport(
            auth,
            form,
            editingSupport,
            setIsModalVisible,
            fetchSupports,
            setSupports,
            setFilteredSupports
          )
        }
        form={form}
        editingSupport={editingSupport}
      />
      <SupportList
        supports={filteredSupports}
        showModal={showModal}
        handleDelete={handleDeleteSupport}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        auth={auth}
        fetchSupports={() =>
          fetchSupports(auth, setSupports, setFilteredSupports)
        }
      />
    </div>
  );
};

export default Support;
