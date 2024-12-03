import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import {
  FaDumbbell,
  FaWallet,
  FaBuilding,
  FaPiggyBank,
  FaHouseUser,
  FaMedkit,
  FaLifeRing,
  FaQuestion,
} from "react-icons/fa";
const swal = require("sweetalert2");

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const BillsPage = () => {
  const api = useAxios();
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await api.get("/bills/");
        setBills(response.data);
      } catch (error) {
        setError("Failed to fetch bills.");
        swal.fire({
          title: "Error!",
          text: error.response?.data?.detail || "Failed to fetch bills.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        if (error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    if (!authTokens) {
      navigate("/login");
    }

    fetchBills();
  }, [authTokens, navigate]);

  const totalBills = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  const groupIncomeByCategory = (bills) => {
    return bills.reduce((acc, bill) => {
      const category = bill.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + (bill.amount || 0);
      return acc;
    }, {});
  };

  const iconMap = {
    GYM: <img src="weightlifter.png"></img>,
    EXTRA: <img src="extra.png"></img>,
    APARTMENT: <img src="rent.png"></img>,
    ALLOWANCE: <img src="subsidy.png"></img>,
    SAVINGS: <img src="piggy-bank.png"></img>,
    BAHAY: <img src="house.png"></img>,
    "EMERGENCY FUND": <img src="emergency.png"></img>,
    "LIFE INSURANCE": <img src="healthcare.png"></img>,
  };

  return (
    <>
      <div className="bg-white p-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <div className="h2">Monthly Bills</div>
          <button className="nav-link" onClick={() => navigate(`/addbills`)}>
            <span data-feather="bar-chart-2" />
            Add Bills
          </button>
        </div>
        <div className="m-10 border border-sky-500 ">
          <div className="flex flex-col text-center gap-4 p-4 ">
            <div className="text-2xl text-pink-400">
              ₱ {totalBills.toFixed(2)}
            </div>
            <div>Monthly Bills </div>
          </div>
        </div>
        <div className="m-10">
          <div className="grid grid-cols-2 xl:grid-cols-4 pb-2 gap-2">
            {bills.map((bill) => {
              const normalizedCategory = bill.category?.trim().toUpperCase();
              console.log(bill.category);
              return (
                <div className="border">
                  <div className="flex flex-col gap-4 p-4">
                    <div className="flex items-center gap-2 w-1/2">
                      {iconMap[normalizedCategory]}
                    </div>
                    <div>{bill.item || "N/A"}</div>
                    <div>{bill.amount}</div>
                    <div>{bill.due_date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillsPage;
