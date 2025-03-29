import React, { useState } from "react";

const ServiceForm = () => {
    const [formData, setFormData] = useState({
        cinemaName: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        information: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        let newErrors = {};
        if (!formData.cinemaName) newErrors.cinemaName = "Tên rạp không được để trống";
        if (!formData.fullName) newErrors.fullName = "Họ và tên không được để trống";
        if (!formData.phoneNumber.match(/^\d{9,15}$/)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email không hợp lệ";
        if (!formData.information) newErrors.information = "Thông tin không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Gửi dữ liệu:", formData);
            setSubmitted(true);
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
                            <input type="text" name="cinemaName" className="w-full p-2 border rounded" onChange={handleChange} />
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
                            <label className="block font-medium">Information of Service:</label>
                            <textarea name="information" className="w-full p-2 border rounded" rows="3" onChange={handleChange}></textarea>
                            {errors.information && <p className="text-red-500 text-sm">{errors.information}</p>}
                        </div>

                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Gửi</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ServiceForm;
