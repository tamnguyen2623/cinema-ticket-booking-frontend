import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/AdminDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faFilm,
  faCalendarAlt,
  faTicketAlt,
  faClipboardList,
  faUsers,
  faChartBar,
  faCommentDots,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import FormModal from "../../common/form-modal";

const DashBroad = () => {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  const [isModalOTPOpen, setIsModalOTPOpen] = useState(false);
  const [isModalUsernameOpen, setIsModalUsernameOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const changePasswordForm = {
    title: "Change Password",
    fields: [
      {
        value: oldPassword,
        label: "Old password",
        name: "oldPassword",
        type: "password",
        required: true,
        onChange: (e) => setOldPassword(e.target.value),
      },
      {
        value: newPassword,
        label: "New password",
        name: "newPassword",
        type: "password",
        required: true,
        onChange: (e) => setNewPassword(e.target.value),
      },
      {
        value: reNewPassword,
        label: "Re-enter password",
        name: "reEnter",
        type: "password",
        required: true,
        onChange: (e) => setReNewPassword(e.target.value),
      },
    ],
    submitText: "Change Password",
  };
  const changeUsernameForm = {
    title: "Change Username",
    fields: [
      {
        value: newUsername,
        label: "New Username",
        name: "newUsername",
        type: "text",
        required: true,
        onChange: (e) => setNewUsername(e.target.value),
      },
    ],
    submitText: "Change Username",
  };

  const showChangePasswordForm = () => {
    setIsModalOTPOpen(true);
  };

  const handleFormModalClose = () => {
    setIsModalOTPOpen(false);
  };

  const onSubmitChangePassword = async (event) => {
    event.preventDefault();
    if (reNewPassword !== newPassword) {
      toast.error("Please re-enter your new password and confirm password!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    console.log("New Username:", newUsername);
    try {
      const response = await axios.post(
        `/auth/change-password`,
        {
          oldPassword,
          newPassword,
          reEnterPassword: reNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.data.code == 1000) {
        setIsModalOTPOpen(false);
        toast.success("Change password successful!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Your password is incorrect!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const onSubmitChangeUsername = async (event) => {
    event.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        `/auth/change-username`,
        { newUsername },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // In response data để kiểm tra cấu trúc
      console.log("Response:", response);

      if (response.data.success) {
        setAuth((prev) => ({ ...prev, username: newUsername }));
        setIsModalUsernameOpen(false);
        toast.success("Username changed successfully!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      } else {
        toast.error("Failed to change username!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      console.log(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      toast.error("Error changing username!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  return (
    <nav className="sidebar">
      <header className="sidebar-header">
        <div className="profile">
          <img
            src="https://i.pravatar.cc/50"
            alt="User Avatar"
            className="avatar"
          />
          <div className="profile-text">
            <span className="name">Huỳnh Tuấn Kiệt</span>
            <span className="role">Admin</span>
          </div>
        </div>
      </header>

      <div className="menu-bar">
        <ul className="menu-links">
          <li className={`nav-link ${isActive("")}`}>
            <button onClick={() => showChangePasswordForm()}>
              Change Password
            </button>
          </li>
          <li className={`nav-link ${isActive("")}`}>
            <button onClick={() => setIsModalUsernameOpen(true)}>
              Change Username
            </button>
          </li>
          <li className={`nav-link ${isActive("/dashboard")}`}>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>DashBoard</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/cinema")}`}>
            <Link to="/cinema">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Cinema</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/room")}`}>
            <Link to="/room">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Room</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/seat")}`}>
            <Link to="/seat">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Seat</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/schedule")}`}>
            <Link to="/schedule">
              <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" />
              <span>Movie Showing</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/ticketmanagement")}`}>
            <Link to="/ticketmanagement">
              <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" />
              <span>Ticket</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/booking")}`}>
            <Link to="/booking">
              <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />
              <span>Booking</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/role")}`}>
            <Link to="/role">
              <FontAwesomeIcon icon={faUsers} className="menu-icon" />
              <span>Role</span>
            </Link>
          </li>
          {/* <li className={`nav-link ${isActive("/revenue")}`}>
            <Link to="/revenue">
              <FontAwesomeIcon icon={faChartBar} className="menu-icon" />
              <span>Revenue</span>
            </Link>
          </li> */}
          <li className={`nav-link ${isActive("/feedback")}`}>
            <Link to="/feedback">
              <FontAwesomeIcon icon={faCommentDots} className="menu-icon" />
              <span>Feedback</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/voucher")}`}>
            <Link to="/voucher">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Voucher</span>
            </Link>
          </li>
          <li className="nav-link button-logou">
            <Link to="/logout">
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="logout-icon"
              />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      {isModalOTPOpen && (
        <FormModal
          handleClose={handleFormModalClose}
          open={isModalOTPOpen}
          formData={changePasswordForm}
          onSubmit={onSubmitChangePassword}
        />
      )}
      {isModalUsernameOpen && (
        <FormModal
          handleClose={() => setIsModalUsernameOpen(false)}
          open={isModalUsernameOpen}
          formData={changeUsernameForm}
          onSubmit={onSubmitChangeUsername}
        />
      )}
    </nav>
  );
};

export default DashBroad;
