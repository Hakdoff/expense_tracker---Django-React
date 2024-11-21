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

const IncomePage = () => {
    const api = useAxios();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const response = await api.get("/income/");
                setIncomes(response.data);
            } catch (error) {
                setError("Failed to fetch incomes.");
                swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.detail || 'Failed to fetch incomes.',
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

        fetchIncomes();
    }, [authTokens, navigate]);

    const getYearAndMonth = (dateString) => {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
        };
    }

    const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const formattedMonth = new Date().toLocaleString("en-US", { month: "long" });

    const yearlyIncome = incomes
        .filter((income) => getYearAndMonth(income.date_received).year === currentYear)
        .reduce((sum, income) => sum + (income.amount || 0), 0);

    const monthlyIncome = incomes
        .filter((income) => getYearAndMonth(income.date_received).month === currentMonth)
        .reduce((sum, income) => sum + (income.amount || 0), 0);


    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        )
    }

    const groupIncomeByCategory = (incomes) => {
        return incomes.reduce((acc, income) => {
            const category = income.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + (income.amount || 0);
            return acc;
        }, {});
    };

    const categoryData = groupIncomeByCategory(incomes);
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
                    <div className="h2">Income</div>
                    <button className="nav-link" onClick={() => navigate(`/addincome`)}>
                        <span data-feather="bar-chart-2" />
                        Add Income
                    </button>
                </div>
                <div className="m-10">
                    <div className='grid grid-cols-3 gap-10'>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-4'>
                                <div className='text-2xl text-blue-400'>${totalIncome.toFixed(2)}</div>
                                <div>Overall Income</div>
                            </div>
                        </div>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-4'>
                                <div className='text-2xl text-purple-400'>${yearlyIncome.toFixed(2)}</div>
                                <div>{currentYear} Income</div>
                            </div>
                        </div>
                        <div className='border border-sky-500 '>
                            <div className='flex flex-col text-center gap-4 p-4 '>
                                <div className='text-2xl text-pink-400'>${monthlyIncome.toFixed(2)}</div>
                                <div>{formattedMonth} Income </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border w-1/2 mx-auto">
                    <h2 className=" text-center text-xl font-bold mb-4">Income by Category</h2>
                    <div className="flex w-full justify-center">
                        <Pie data={chartData}  />
                    </div>
                </div>
                <div className='m-10'>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Date Received</th>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Category</th>
                                <th className="border w-1/2 border-gray-300 px-4 py-2">Description</th>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map((income) => (
                                <tr key={income.id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(income.date_received).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{income.category}</td>
                                    <td className="border border-gray-300 px-4 py-2">{income.description || "N/A"}</td>
                                    <td className="border border-gray-300 px-4 py-2">{income.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default IncomePage