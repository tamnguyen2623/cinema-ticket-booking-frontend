import {
  ClockIcon,
  FilmIcon,
  HomeModernIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  UsersIcon,
  VideoCameraIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import FormModal from "../common/form-modal";

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, SetLoggingOut] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [isModalOTPOpen, setIsModalOTPOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isModalUsernameOpen, setIsModalUsernameOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
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

  const navigate = useNavigate();
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

  const showChangePasswordForm = () => {
    setIsModalOTPOpen(true);
  };

  const onLogout = async () => {
    try {
      SetLoggingOut(true);
      const response = await axios.get("/auth/logout");
      // console.log(response)
      setAuth({ username: null, email: null, role: null, token: null });
      sessionStorage.clear();
      navigate("/");
      toast.success("Logout successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetLoggingOut(false);
    }
  };

  const menuLists = () => {
    return (
      <>
        <div className="flex flex-col gap-2 lg:flex-row">
          <Link
            to={"/cinema"}
            className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
              window.location.pathname === "/cinema"
                ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                : "bg-gray-600"
            }`}
          >
            <HomeModernIcon className="h-6 w-6" />
            <p>Cinema</p>
          </Link>
          <Link
            to={"/schedule"}
            className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
              window.location.pathname === "/schedule"
                ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                : "bg-gray-600"
            }`}
          >
            <ClockIcon className="h-6 w-6" />
            <p>Schedule</p>
          </Link>
          {auth.role === "user" && (
            <Link
              to={"/ticket"}
              className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                window.location.pathname === "/ticket"
                  ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                  : "bg-gray-600"
              }`}
            >
              <TicketIcon className="h-6 w-6" />
              <p>Ticket</p>
            </Link>
          )}
          {auth.role === "admin" && (
            <>
              <Link
                to={"/movie"}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                  window.location.pathname === "/movie"
                    ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                    : "bg-gray-600"
                }`}
              >
                <VideoCameraIcon className="h-6 w-6" />
                <p>Movie</p>
              </Link>
              <Link
                to={"/search"}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                  window.location.pathname === "/search"
                    ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                    : "bg-gray-600"
                }`}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
                <p>Search</p>
              </Link>
              <Link
                to={"/user"}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                  window.location.pathname === "/user"
                    ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                    : "bg-gray-600"
                }`}
              >
                <UsersIcon className="h-6 w-6" />
                <p>User</p>
              </Link>
              <Link
                to={"/order"}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                  window.location.pathname === "/order"
                    ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                    : "bg-gray-600"
                }`}
              >
                <NewspaperIcon className="h-6 w-6" />
                <p>Order</p>
              </Link>
              <Link
                to={"/dashboard"}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                  window.location.pathname === "/dashboard"
                    ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                    : "bg-gray-600"
                }`}
              >
                <NewspaperIcon className="h-6 w-6" />
                <p>Dashboard</p>
              </Link>
              <Link
                to={"/room"}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-1 text-white hover:bg-gray-500 ${
                  window.location.pathname === "/management-room"
                    ? "bg-gradient-to-br from-indigo-800 to-blue-700"
                    : "bg-gray-600"
                }`}
              >
                <HomeModernIcon className="h-6 w-6" />
                <p>Management Room</p>
              </Link>
            </>
          )}
        </div>
        <div className="flex grow items-center justify-center gap-3 lg:justify-end">
          {auth.fullname && (
            <p className="text-md whitespace-nowrap leading-none text-white">
              Welcome {auth.fullname}!
            </p>
          )}
          {auth.username && (
            <>
              <button
                className="rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
                onClick={() => showChangePasswordForm()}
              >
                Change Password
              </button>

              <button
                className="rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
                onClick={() => setIsModalUsernameOpen(true)}
              >
                Change Username
              </button>
            </>
          )}

          {auth.token ? (
            <button
              className="rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 disabled:from-slate-500 disabled:to-slate-400"
              onClick={() => onLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Processing..." : "Logout"}
            </button>
          ) : (
            <button className="rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400">
              <Link to={"/login"}>Login</Link>
            </button>
          )}
        </div>
      </>
    );
  };

  const handleFormModalClose = () => {
    setIsModalOTPOpen(false);
  };

  return (
    <nav className="flex flex-col items-center justify-between gap-2 bg-gray-900 px-4 py-3 drop-shadow-lg lg:flex-row lg:justify-start sm:px-8">
      <div className="flex w-full flex-row justify-between lg:w-fit">
        <button
          className="flex flex-row items-center gap-2"
          onClick={() => navigate("/")}
        >
          <FilmIcon className="h-8 w-8 text-white" />
          <h1 className="mr-2 text-xl text-white">Cinema</h1>
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-700 lg:hidden"
          onClick={() => toggleMenu()}
        >
          <Bars3Icon className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="hidden grow justify-between gap-2 lg:flex">
        {menuLists()}
      </div>
      {menuOpen && (
        <div className="flex w-full grow flex-col gap-2 lg:hidden">
          {menuLists()}
        </div>
      )}
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

export default Navbar;
