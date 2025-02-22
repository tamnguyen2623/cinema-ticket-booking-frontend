import { Outlet } from "react-router-dom";
import Sidebar from "../components/AdminDashboard/AdminDashboard";

const AdminLayout = () => {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "200px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
