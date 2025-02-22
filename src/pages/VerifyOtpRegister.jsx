import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtpRegister = ({ email }) => {
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsVerifying(true);
        try {
            const response = await axios.post("/auth/verifyOtp", { email, otp: data.otp });
            if (response.data.success) {
                toast.success("OTP verified successfully!", { position: "top-center", autoClose: 2000 });
                navigate("/login");
            } else {
                toast.error(response.data.message, { position: "top-center", autoClose: 2000 });
            }
        } catch (error) {
            toast.error("Error verifying OTP. Please try again.", { position: "top-center", autoClose: 2000 });
        } finally {
            setIsVerifying(false);
        }
    };

    const resendOtp = async () => {
        setIsResending(true);
        try {
            const response = await axios.post("/auth/resendotp", { email });
            if (response.data.success) {
                toast.success("OTP sent successfully!", { position: "top-center", autoClose: 2000 });
            } else {
                toast.error(response.data.message, { position: "top-center", autoClose: 2000 });
            }
        } catch (error) {
            toast.error("Error resending OTP. Please try again.", { position: "top-center", autoClose: 2000 });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-4 shadow-xl">
                <h2 className="text-center text-4xl font-extrabold text-gray-900">Verify OTP</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        name="otp"
                        type="text"
                        {...register("otp", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="Enter OTP"
                    />
                    {errors.otp && <span className="text-sm text-red-500">OTP is required</span>}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        disabled={isVerifying}
                    >
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
                <button
                    onClick={resendOtp}
                    className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                    disabled={isResending}
                >
                    {isResending ? "Resending..." : "Resend OTP"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOtpRegister;
