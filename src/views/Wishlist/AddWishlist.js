import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
const swal = require('sweetalert2');

const AddWishlistPage = () => {
    const { authTokens } = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        price: "",
        description: "",
        item: "",
        category: "",
        is_bought: "",
    });

    const categories = [
        { value: "FOOD", label: "Food" },
        { value: "TRANSPORTATION", label: "Transportation" },
        { value: "CLOTHING", label: "Clothing" },
        { value: "SHOPPING", label: "Shopping" },
        { value: "HEALTHCARE", label: "Healthcare" },
        { value: "SKINCARE", label: "Skincare" },
        { value: "GYM", label: "Gym" },
        { value: "GROCERY", label: "Grocery" },
        { value: "FAMILY", label: "Family" },
        { value: "OTHER", label: "Other" },
    ];

    useEffect(() => {
        if (!authTokens) {
            navigate('/login');
        }
    }, [authTokens, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const processValue = type === 'checkbox'
            ? checked  // Convert checkbox to a boolean
            : name === 'price'
                ? value === '' ? '' : parseFloat(value)  // Parse number if needed
                : value;

        setFormData(prev => ({
            ...prev,
            [name]: processValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.price || !formData.item) {
            setError("price and item are required fields");
            return;
        }

        const formattedData = {
            ...formData,

        };

        try {
            const response = await api.post("/wishlist/", formattedData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            console.log("Wishlist added successfully:", response.data);
            swal.fire({
                title: 'Success!',
                text: 'Wishlist added successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/wishlist');
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                const errorMessage = error.response?.data?.detail ||
                    error.response?.data?.message ||
                    Object.values(error.response?.data || {}).flat().join(', ') ||
                    "Failed to add wishlist. Please try again.";
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
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                <div className="h2">Add Wishlist</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="number"
                        name="price"
                        placeholder="price"
                        value={formData.price}
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
                        name="item"
                        placeholder="item"
                        value={formData.item}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
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
                        type="checkbox"
                        name="is_bought"
                        value={formData.is_bought}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"

                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Add Wishlist
                </button>
            </form>
        </div>
    );
};

export default AddWishlistPage;