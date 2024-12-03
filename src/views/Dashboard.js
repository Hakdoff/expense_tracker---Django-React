import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { jwtDecode } from "jwt-decode";
import "../../src/index.css";
import AuthContext from "../context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import BillsPage from "./Bills/FetchBills";
import WishlistPage from "./Wishlist/FetchWishlist";

const swal = require("sweetalert2");

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Dashboard() {
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [savings, setSavings] = useState([]);
  const [combinedTransactions, setCombinedTransactions] = useState([]);

  if (token) {
    const decode = jwtDecode(token);
    var user_id = decode.user_id;
    var username = decode.username;
    var full_name = decode.full_name;
    var image = decode.image;
  }

  useEffect(() => {
    if (!authTokens) {
      navigate("/login");
      return;
    }
    const fetchIncomes = async () => {
      try {
        const response = await api.get("/income/");
        setIncomes(response.data);
      } catch (error) {
        setError("Failed to fetch incomes.");
        swal.fire({
          title: "Error!",
          text: error.response?.data?.detail || "Failed to fetch incomes.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        if (error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expense/");
        setExpenses(response.data);
      } catch (error) {
        setError("Failed to fetch expenses.");
        swal.fire({
          title: "Error!",
          text: error.response?.data?.detail || "Failed to fetch expenses.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        if (error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    const fetchSavings = async () => {
      try {
        const response = await api.get("/savings/");
        setSavings(response.data);
      } catch (error) {
        setError("Failed to fetch savings.");
        swal.fire({
          title: "Error!",
          text: error.response?.data?.detail || "Failed to fetch savings.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        if (error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchSavings();
    fetchExpenses();
    fetchIncomes();
  }, [authTokens, navigate]);

  useEffect(() => {
    const combineAndSortTransactions = () => {
      const allTransactions = [
        ...incomes.map((income) => ({
          ...income,
          type: "Income",
          date: new Date(income.date_received),
        })),
        ...expenses.map((expense) => ({
          ...expense,
          type: "Expense",
          date: new Date(expense.date_spended),
        })),
      ];

      allTransactions.sort((a, b) => b.date - a.date);
      console.log("Combined Transactions:", allTransactions); // Debugging line
      setCombinedTransactions(allTransactions);
    };

    combineAndSortTransactions();
  }, [incomes, expenses]);

  const totalSavings = savings.reduce(
    (sum, saving) => sum + (saving.amount || 0),
    0
  );
  const totalIncome = incomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  const groupByMonth = (data) => {
    const grouped = Array(12).fill(0);
    data.forEach((item) => {
      const month = new Date(item.date).getMonth();
      grouped[month] += item.amount || 0;
    });
    console.log("Grouped Data:", grouped); // Debugging line
    return grouped;
  };

  const monthlyIncome = incomes.length
    ? groupByMonth(incomes)
    : Array(12).fill(0);
  const monthlyExpenses = expenses.length
    ? groupByMonth(expenses)
    : Array(12).fill(0);

  return (
    <>
      <div className="  bg-white">
        <div className="m-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <div className="h2">Dashboard</div>
          </div>
          <div className="m-10">
            <div className="grid grid-cols-3  gap-10">
              <div className="border border-sky-500">
                <div className="flex flex-col text-center gap-4 p-4">
                  <div className="text-2xl text-blue-400">
                    ${totalIncome.toFixed(2)}
                  </div>
                  <div>Income</div>
                </div>
              </div>
              <div className="border border-sky-500">
                <div className="flex flex-col text-center gap-4 p-4">
                  <div className="text-2xl text-purple-400">
                    ${totalExpenses.toFixed(2)}
                  </div>
                  <div>Expenses</div>
                </div>
              </div>
              <div className="border border-sky-500 ">
                <div className="flex flex-col text-center gap-4 p-4 ">
                  <div className="text-2xl text-pink-400">
                    ${totalSavings.toFixed(2)}
                  </div>
                  <div>Savings</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex m-3 md:flex-col xl:flex-row">
            <div className="border m-4 xl:w-1/2">
              <BillsPage></BillsPage>
            </div>
          </div>
          <div>
            Transactions
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border w-1/4 border-gray-300 px-4 py-2">
                    Date Spended
                  </th>
                  <th className="border w-1/5 border-gray-300 px-4 py-2">
                    Type
                  </th>
                  <th className="border w-1/4 border-gray-300 px-4 py-2">
                    Category
                  </th>
                  <th className="border w-1/2 border-gray-300 px-4 py-2">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {combinedTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction?.type &&
                        new Date(
                          transaction.type === "Expense"
                            ? transaction.date_spended
                            : transaction.date_received
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.description || "N/A"}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-medium ${
                        transaction.type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
