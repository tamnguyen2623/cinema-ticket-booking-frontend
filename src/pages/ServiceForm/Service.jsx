import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Import context
import { useNavigate } from "react-router-dom"; // Để chuyển hướng

const ServiceForm = () => {
    const { auth } = useContext(AuthContext); // Lấy thông tin đăng nhập
    const navigate = useNavigate(); // Hook để điều hướng

    const [formData, setFormData] = useState({
        cinemaName: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        information: "",
        service: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [cinemas, setCinemas] = useState([]);

    const services = ["Standard Cleaning", "Premium Support", "VIP Experience"];

    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await axios.get("/cinema");
                setCinemas(response.data.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách rạp:", error);
                setCinemas([]);
            }
        };
        fetchCinemas();
    }, []);

    const validate = () => {
        let newErrors = {};
        if (!formData.cinemaName.trim()) newErrors.cinemaName = "Tên rạp không được để trống";
        if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
        if (!formData.phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumber = "Số điện thoại phải có đúng 10 số";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email không hợp lệ";
        if (!formData.information.trim()) newErrors.information = "Thông tin không được để trống";
        if (!formData.service) newErrors.service = "Vui lòng chọn một dịch vụ";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra nếu chưa đăng nhập thì chuyển hướng đến trang login
        if (!auth?.user) {
            alert("Bạn cần đăng nhập trước khi gửi biểu mẫu!");
            navigate("/login"); // Điều hướng đến trang đăng nhập
            return;
        }

        if (validate()) {
            try {
                await axios.post("/service", formData, {
                    headers: { "Content-Type": "application/json" }
                });
                setSubmitted(true);
            } catch (error) {
                console.error("Lỗi khi gửi dữ liệu:", error);
            }
        }
    };

    return (
        <div>
            <div className="movie-detail-header">
                <p className="movie-detail-title">SIGN UP FOR SERVICE</p>
            </div>

            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                {submitted ? (
                    <p className="text-green-600">Gửi thành công!</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-medium">Cinema Name:</label>
                            <select name="cinemaName" className="w-full p-2 border rounded" onChange={handleChange}>
                                <option value="">Select a cinema</option>
                                {cinemas.map((cinema, index) => (
                                    <option key={index} value={cinema.name}>{cinema.name}</option>
                                ))}
                            </select>
                            {errors.cinemaName && <p className="text-red-500 text-sm">{errors.cinemaName}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium">Full Name:</label>
                            <input type="text" name="fullName" className="w-full p-2 border rounded" onChange={handleChange} />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium">Phone Number:</label>
                            <input type="text" name="phoneNumber" className="w-full p-2 border rounded" onChange={handleChange} />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium">Email:</label>
                            <input type="email" name="email" className="w-full p-2 border rounded" onChange={handleChange} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium">Service:</label>
                            <select name="service" className="w-full p-2 border rounded" onChange={handleChange}>
                                <option value="">Select a service</option>
                                {services.map((service, index) => (
                                    <option key={index} value={service}>{service}</option>
                                ))}
                            </select>
                            {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium">Information of Service:</label>
                            <textarea name="information" className="w-full p-2 border rounded" rows="3" onChange={handleChange}></textarea>
                            {errors.information && <p className="text-red-500 text-sm">{errors.information}</p>}
                        </div>

                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Gửi
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ServiceForm;
