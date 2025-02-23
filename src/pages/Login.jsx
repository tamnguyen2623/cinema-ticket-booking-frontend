import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import GoogleIcon from "@mui/icons-material/Google";
import FormModal from "../components/form-modal";

const getCookie = (name) => {
  const cookieArr = document.cookie.split("; ");
  for (let cookie of cookieArr) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [errorsMessage, setErrorsMessage] = useState("");
  const [isLoggingIn, SetLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [isOtpFormOpen, setIsOtpFormOpen] = useState(false);
  const enterEmailForm = {
    title: "Enter Your Email",
    fields: [
      {
        value: email,
        label: "Email",
        name: "email",
        type: "text",
        required: true,
        onChange: (e) => setEmail(e.target.value),
      },
    ],
    submitText: "Get OTP",
  };
  const enterOtpForm = {
    title: "Enter The OTP",
    fields: [
      {
        value: email,
        label: "Email",
        name: "email",
        type: "text",
        disable: true,
        required: true,
        onChange: (e) => setEmail(e.target.value),
      },
      {
        value: otp,
        label: "OTP",
        name: "otp",
        type: "text",
        required: true,
        onChange: (e) => setOtp(e.target.value),
      },
    ],
    submitText: "Verify OTP",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onGetOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/auth/forget-password/getOtp`, {
        email,
      });
      // console.log(response.data)
      if (response.data.code == 1000) {
        setIsEmailFormOpen(false);
        toast.success("An email with OTP was sent to you!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
        setIsOtpFormOpen(true);
      } else {
        toast.error("User not found!", {
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
  const onGetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/auth/forget-password/verifyOtp`, {
        email,
        otp,
      });
      // console.log(response.data)
      if (response.data.code == 1000) {
        setIsEmailFormOpen(false);
        toast.success("An email with new password was sent to you!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
        setIsOtpFormOpen(false);
      } else {
        toast.error("Invalid OTP!", {
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

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setAuth((prev) => ({ ...prev, token: token }));
      document.cookie = "token=; path=/; max-age=0";
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      navigate("/"); // Redirect only if token exists
    }
    setIsLoading(false); // Loading is complete
  }, [navigate, setAuth]);

  const showForgetPasswordForm = () => {
    setIsEmailFormOpen(true);
  };

  const onSubmit = async (data) => {
    SetLoggingIn(true);
    try {
      const response = await axios.post("/auth/login", data);
      console.log("data", response);
      // Lưu thông tin đăng nhập vào AuthContext
      setAuth((prev) => ({
        ...prev,
        token: response.data.token,
        role: response.data.role, // Lưu vai trò của người dùng
      }));

      // Hiển thị thông báo đăng nhập thành công
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      console.log("admin", response.data.role);
      // Điều hướng dựa trên vai trò của người dùng
      if (response.data.role == 'admin') {
        navigate("/admin/ticketmanagement"); // Nếu là Admin, vào trang Admin
      } else {
        navigate("/movieshowing"); // Nếu là User, vào trang Home
      }
    } catch (error) {
      console.error(error.response?.data);
      setErrorsMessage(error.response?.data);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetLoggingIn(false);
    }
  };

  const inputClasses = () => {
    return "appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500";
  };

  const handleLoginGoogle = () => {
    window.location.href = "http://localhost:8080/login/google";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleFormModalClose = () => {
    setIsEmailFormOpen(false);
    setIsOtpFormOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-4 shadow-xl">
        <div>
          <h2 className="mt-4 text-center text-4xl font-extrabold text-gray-900">
            Login
          </h2>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            name="username"
            type="text"
            autoComplete="username"
            {...register("username", { required: true })}
            className={inputClasses`${errors.username ? "border-red-500" : ""}`}
            placeholder="Username"
          />
          {errors.username && (
            <span className="text-sm text-red-500">Username is required</span>
          )}
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
            className={inputClasses`${errors.password ? "border-red-500" : ""}`}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-sm text-red-500">Password is required</span>
          )}

          <div>
            {errorsMessage && (
              <span className="text-sm text-red-500">{errorsMessage}</span>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 bg-gradient-to-br from-indigo-600 to-blue-500 py-2 px-4 font-medium text-white drop-shadow-md hover:bg-blue-700 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-slate-500 disabled:to-slate-400"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Processing..." : "Login"}
            </button>
            <p className="text-center mt-4">Or</p>
            <button
              type="button"
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-white border border-gray-300 py-2 px-4 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-200"
              onClick={() => handleLoginGoogle()}
            >
              <GoogleIcon /> Login With Google
            </button>
          </div>
          <p className="text-right">
            Don’t have an account?{" "}
            <Link to={"/register"} className="font-bold text-blue-600">
              Register here
            </Link>
          </p>
          <p className="text-right">
            Forget password?{" "}
            <button
              onClick={showForgetPasswordForm}
              type="button"
              className="font-bold text-blue-600"
            >
              Get password here
            </button>
          </p>
        </form>
      </div>
      {isEmailFormOpen && (
        <FormModal
          handleClose={handleFormModalClose}
          open={isEmailFormOpen}
          formData={enterEmailForm}
          onSubmit={onGetOtp}
        />
      )}
      {isOtpFormOpen && (
        <FormModal
          handleClose={handleFormModalClose}
          open={isOtpFormOpen}
          formData={enterOtpForm}
          onSubmit={onGetPassword}
        />
      )}
    </div>
  );
};

export default Login;