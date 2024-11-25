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
const swal = require('sweetalert2');

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
                    title: 'Error!',
                    text: error.response?.data?.detail || 'Failed to fetch bills.',
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

        fetchBills();
    }, [authTokens, navigate]);

    const totalBills = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const formattedMonth = new Date().toLocaleString("en-US", { month: "long" });


    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        )
    }

    const groupIncomeByCategory = (bills) => {
        return bills.reduce((acc, bill) => {
            const category = bill.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + (bill.amount || 0);
            return acc;
        }, {});
    };

    const categoryData = groupIncomeByCategory(bills);

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
                <div className='m-10 border border-sky-500 '>
                            <div className='flex flex-col text-center gap-4 p-4 '>
                                <div className='text-2xl text-pink-400'>${totalBills.toFixed(2)}</div>
                                <div>{formattedMonth} Income </div>
                            </div>
                        </div>
                <div className='m-10'>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Item</th>
                                <th className="border w-1/2 border-gray-300 px-4 py-2">Amount</th>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((income) => (
                                <tr key={income.id}>
                                    <td className="border border-gray-300 px-4 py-2">{income.item || "N/A"}</td>
                                    
                                    <td className="border border-gray-300 px-4 py-2">{income.amount}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(income.due_date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default BillsPage