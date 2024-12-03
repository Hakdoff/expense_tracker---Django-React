import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
const swal = require("sweetalert2");

const AddBillPage = () => {
  const { authTokens } = useContext(AuthContext);
  const api = useAxios();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    item: "",
    due_date: "",
  });

  const categories = [
    { value: "GYM", label: "Gym" },
    { value: "EXTRA", label: "Extra" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "ALLOWANCE", label: "Allowance" },
    { value: "SAVINGS", label: "Savings" },
    { value: "BAHAY", label: "Bahay" },
    { value: "EMERGENCY FUND", label: "Emergency Fund" },
    { value: "LIFE INSURANCE", label: "Life Insurance" },
  ];

  useEffect(() => {
    if (!authTokens) {
      navigate("/login");
    }
  }, [authTokens, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const processValue =
      name === "amount" ? (value === "" ? "" : parseFloat(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.amount || !formData.due_date) {
      setError("Amount and date are required fields");
      return;
    }

    const formattedData = {
      ...formData,
    };

    try {
      const response = await api.post("/bills/", formattedData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      console.log("Bill added successfully:", response.data);
      swal.fire({
        title: "Success!",
        text: "Bill added successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          Object.values(error.response?.data || {})
            .flat()
            .join(", ") ||
          "Failed to add bills. Please try again.";
        setError(errorMessage);
        swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
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
        <div className="h2">Add Monthly Bills</div>
      </div>
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
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Bill
        </button>
      </form>
    </div>
  );
};

export default AddBillPage;
