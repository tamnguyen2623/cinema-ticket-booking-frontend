import {
  fetchSupport,
  createOrUpdateSupport,
  deleteSupport,
  toggleSupportStatus,
} from "../../components/api/supportApi";
import { toast } from "react-toastify";

// ✅ Lấy danh sách hỗ trợ từ server
export const fetchSupports = async (
  auth,
  setSupports,
  setFilteredSupports,
  searchTerm = "",
  filter = "all"
) => {
  try {
    if (!auth?.token) {
      console.error("Unauthorized: No token available");
      return;
    }
    const fetchedSupports = await fetchSupport(auth.token);
    setSupports(fetchedSupports);
    const filteredData = applyFilters(fetchedSupports, searchTerm, filter);
    setFilteredSupports(filteredData);
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};

// ✅ Bộ lọc tìm kiếm theo `question` hoặc `type`
export const applyFilters = (supports, searchTerm, filter) => {
  let filteredData = [...supports];
  if (searchTerm) {
    filteredData = filteredData.filter((support) =>
      support.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (filter !== "all") {
    filteredData = filteredData.filter((support) => support.type === filter);
  }
  return filteredData;
};

// ✅ Tạo hoặc cập nhật Support
export const handleCreateOrUpdateSupport = async (
  auth,
  form,
  editingSupport,
  setIsModalVisible,
  fetchSupports,
  setSupports,
  setFilteredSupports
) => {
  try {
    const values = await form.validateFields();
    if (!values.question || !values.type)
      throw new Error("Missing required fields");

    let response;
    if (editingSupport) {
      response = await createOrUpdateSupport(
        auth.token,
        values,
        editingSupport._id
      );
      toast.success("Support updated!");
    } else {
      response = await createOrUpdateSupport(auth.token, values);
      toast.success("Support created!");
      setSupports((prev) => [response.data, ...prev]);
      setFilteredSupports((prev) => [response.data, ...prev]);
    }

    setIsModalVisible(false);
    form.resetFields();
    fetchSupports(auth, setSupports, setFilteredSupports);
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};

// ✅ Bật/tắt trạng thái Support
export const handleToggleSupportStatus = async (
  auth,
  supportId,
  isDelete,
  fetchSupports
) => {
  try {
    await toggleSupportStatus(auth.token, supportId, isDelete);
    toast.success(`Support ${isDelete ? "disabled" : "enabled"} successfully!`);
    fetchSupports();
  } catch (error) {
    toast.error(`Failed to update support status: ${error.message}`);
  }
};
