import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
const swal = require('sweetalert2');

const AddIncomePage = () => {
    const { authTokens } = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        amount: "",
        description: "",
        date_received: "",
        category: "",
    });

    const categories = [
        { value: "SALARY", label: "Salary" },
        { value: "ALLOWANCE", label: "Allowance" },
        { value: "GIFT", label: "Gift" },
        { value: "OTHER", label: "Other" },
    ];

    useEffect(() => {
        if (!authTokens) {
            navigate('/login');
        }
    }, [authTokens, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const processValue = name === 'amount' ?
            value === '' ? '' : parseFloat(value) :
            value;

        setFormData(prev => ({
            ...prev,
            [name]: processValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.amount || !formData.date_received) {
            setError("Amount and date are required fields");
            return;
        }

        const formattedData = {
            ...formData,
            date_received: new Date(formData.date_received).toISOString(),
        };

        try {
            const response = await api.post("/income/", formattedData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            console.log("Income added successfully:", response.data);
            swal.fire({
                title: 'Success!',
                text: 'Income added successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                const errorMessage = error.response?.data?.detail ||
                    error.response?.data?.message ||
                    Object.values(error.response?.data || {}).flat().join(', ') ||
                    "Failed to add income. Please try again.";
                setError(errorMessage);
                swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <input
                        type="date"
                        name="date_received"
                        value={formData.date_received}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Add Income
                </button>
            </form>
        </div>
    );
};

export default AddIncomePage;