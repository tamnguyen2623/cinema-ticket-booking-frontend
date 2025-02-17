import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/AdminDashboard/AdminDashboard";

const AdminLayout = () => {
  const { auth } = useContext(AuthContext);

  if (auth.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "200px" }}>
        <Outlet />
      </div>
    </div>

    // <div className="d-flex">
    //   <div className="col-2 bg-light p-3">
    //     <Sidebar />
    //   </div>
    //   <div className="col-10 p-4">
    //     <Outlet />
    //   </div>
    // </div>
  );
};

export default AdminLayout;
