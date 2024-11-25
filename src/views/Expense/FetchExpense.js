import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
const swal = require('sweetalert2');

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpensePage = () => {
    const api = useAxios();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get("/expense/");
                setExpenses(response.data);
            } catch (error) {
                setError("Failed to fetch expenses.");
                swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.detail || 'Failed to fetch expenses.',
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
                if (error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        if (!authTokens) {
            navigate('/login');
        }

        fetchExpenses();
    }, [authTokens, navigate]);

    const getYearAndMonth = (dateString) => {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
        };
    }

    const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const today = new Date().getDate();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const formattedMonth = new Date().toLocaleString("en-US", { month: "long" });

    const yearlyExpense = expenses
        .filter((expense) => getYearAndMonth(expense.date_spended).year === currentYear)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    const monthlyExpense = expenses
        .filter((expense) => getYearAndMonth(expense.date_spended).month === currentMonth)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);

    const dailyExpense = expenses
        .filter((expense) => getYearAndMonth(expense.date_spended).day === today)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);


    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        )
    }

    const groupIncomeByCategory = (expenses) => {
        return expenses.reduce((acc, expense) => {
            const category = expense.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + (expense.amount || 0);
            return acc;
        }, {});
    };

    const categoryData = groupIncomeByCategory(expenses);
    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
                ],
                hoverBackgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
                ],
            }
        ]
    };

    return (
        <>
            <div className="bg-white">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <div className="h2">Expenses</div>
                    <button className="nav-link" onClick={() => navigate(`/addexpense`)}>
                        <span data-feather="bar-chart-2" />
                        Add Expense
                    </button>
                </div>
                <div className="m-10">
                    <div className='grid grid-cols-4 gap-10'>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-3'>
                                <div className='text-2xl text-blue-400'>${totalExpense.toFixed(2)}</div>
                                <div>Overall Expenses</div>
                            </div>
                        </div>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-3'>
                                <div className='text-2xl text-purple-400'>${yearlyExpense.toFixed(2)}</div>
                                <div>{currentYear} Expenses</div>
                            </div>
                        </div>
                        <div className='border border-sky-500 '>
                            <div className='flex flex-col text-center gap-4 p-3 '>
                                <div className='text-2xl text-pink-400'>${monthlyExpense.toFixed(2)}</div>
                                <div>{formattedMonth} Expenses </div>
                            </div>
                        </div>
                        <div className='border border-sky-500 '>
                            <div className='flex flex-col text-center gap-4 p-3 '>
                                <div className='text-2xl text-pink-400'>${dailyExpense.toFixed(2)}</div>
                                <div>{formattedMonth} Daily Expenses </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border w-1/2 mx-auto">
                    <h2 className=" text-center text-xl font-bold mb-4">Expenses by Category</h2>
                    <div className="flex w-full justify-center">
                        <Pie data={chartData}  />
                    </div>
                </div>
                <div className='m-10'>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Date Spended</th>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Category</th>
                                <th className="border w-1/2 border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(expense.date_spended).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{expense.category}</td>
                                    <td className="border border-gray-300 px-4 py-2">{expense.description || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ExpensePage