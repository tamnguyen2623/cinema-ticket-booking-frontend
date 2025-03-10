import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleIcon from "@mui/icons-material/Google";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [errorsMessage, setErrorsMessage] = useState("");
  const [isRegistering, SetIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    SetIsRegistering(true);
    try {
      const response = await axios.post("/auth/register", data);

      switch (response.data.code) {
        case "10001":
          toast.error("Username already exist!", {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
          });
          navigate("/register");
          break;
        default:
          toast.success("Registration successful! Please verify your OTP.", {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
          });
          navigate("/VerifyOtpRegister", { state: { email: data.email } });
      }
    } catch (error) {
      toast.error("Error! Please try again", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      navigate("/register");
    } finally {
      SetIsRegistering(false);
    }
  };
  const handleLoginGoogle = () => {
    window.location.href = "http://localhost:8080/login/google";
  };
  const inputClasses = () => {
    return "appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-4 shadow-xl">
        <div>
          <h2 className="mt-4 text-center text-4xl font-extrabold text-gray-900">
            Register
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
            name="email"
            type="email"
            autoComplete="email"
            {...register("email", { required: true })}
            className={inputClasses`${errors.email ? "border-red-500" : ""}`}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-sm text-red-500">Email is required</span>
          )}
          <input
            name="fullname"
            type="text"
            autoComplete="fullname"
            {...register("fullname", { required: true })}
            className={inputClasses`${errors.fullname ? "border-red-500" : ""}`}
            placeholder="Fullname"
          />
          {errors.fullname && (
            <span className="text-sm text-red-500">Fullname is required</span>
          )}
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className={inputClasses`${errors.password ? "border-red-500" : ""}`}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password?.message}
            </span>
          )}
          <div>
            {errorsMessage && (
              <span className="text-sm text-red-500">{errorsMessage}</span>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 bg-gradient-to-br from-indigo-600 to-blue-500 py-2 px-4 font-medium text-white drop-shadow-md hover:bg-blue-700 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-slate-500 disabled:to-slate-400"
              disabled={isRegistering}
            >
              {isRegistering ? "Processing..." : "Register"}
            </button>
            <p className="text-center mt-4">Or</p>
            <button
              type="button"
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-white border border-gray-300 py-2 px-4 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-200"
              onClick={() => handleLoginGoogle()}
            >
              <GoogleIcon /> Register With Google
            </button>
          </div>
          <p className="text-right">
            Already have an account?{" "}
            <Link to={"/login"} className="font-bold text-blue-600">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
