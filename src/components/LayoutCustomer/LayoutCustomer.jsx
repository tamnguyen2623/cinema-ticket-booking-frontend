
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Navbar1 from "../../components/Navbar";

const Layout = () => {

  return (
    <>
      <Navbar1 />
      <Header />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
