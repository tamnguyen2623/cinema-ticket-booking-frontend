import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./services.css";

const ServiceForm = () => {
    const [formData, setFormData] = useState({
        cinemaName: "",
        fullName: "",
        phoneNumber: "",
        email: "",
        information: "",
        service: "",
    });

    const [errors, setErrors] = useState({});
    const [cinemas, setCinemas] = useState([]);

    const services = [
        "Group Ticket Purchase",
        "Event Hall Rental",
        "Cinema Advertising",
        "Gift Voucher / E-Code",
    ];

    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await axios.get("/cinema");
                setCinemas(response.data.data || []);
            } catch (error) {
                console.error("Error fetching cinema list:", error);
                setCinemas([]);
            }
        };
        fetchCinemas();
    }, []);

    const validate = () => {
        let newErrors = {};
        if (!formData.cinemaName.trim()) newErrors.cinemaName = "Cinema name is required";
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumber = "Phone number must be exactly 10 digits";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
        if (!formData.information.trim()) newErrors.information = "Service information is required";
        if (!formData.service) newErrors.service = "Please select a service";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                await axios.post("/service", formData, {
                    headers: { "Content-Type": "application/json" },
                });
                toast.success("Successfully submitted!");
            } catch (error) {
                console.error("Error submitting data:", error);
                toast.error("Submission failed. Please try again.");
            }
        }
    };

    return (
        <div className="pt-10 pb-16" style={{ backgroundColor: "#DAD2B4" }}>
            <ToastContainer />
            <div className="title-ticket">Our Service</div>
            <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium">Cinema Name:</label>
                        <select name="cinemaName" className="w-full p-2 border rounded" onChange={handleChange}>
                            <option value="" hidden>Select a cinema</option>
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
                            <option value="" hidden>Select a service</option>
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

                    <div className="mb-4 text-right">
                        <button type="submit" className="text-white px-4 py-2 rounded hover:opacity-80" style={{ backgroundColor: "#cdc197", color: "#000" }}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;