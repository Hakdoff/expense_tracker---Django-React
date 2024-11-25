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

const SavingsPage = () => {
    const api = useAxios();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [savings, setSavings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSavings = async () => {
            try {
                const response = await api.get("/savings/");
                setSavings(response.data);
            } catch (error) {
                setError("Failed to fetch savings.");
                swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.detail || 'Failed to fetch savings.',
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

        fetchSavings();
    }, [authTokens, navigate]);

    const getSavingsByCategory = (category) => 
        savings
            .filter((saving) => saving.category === category)
            .reduce((sum, saving) => sum + (saving.amount || 0), 0);
            
    const totalSavings = savings.reduce((sum, saving) => sum + (saving.amount || 0), 0);
    const emergencyFundSavings = getSavingsByCategory("EMERGENCY FUND");
    const saving = getSavingsByCategory("SAVING");
    const extra = getSavingsByCategory("EXTRA");

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <div className="h2">Savings</div>
                    <button className="nav-link" onClick={() => navigate(`/addsavings`)}>
                        <span data-feather="bar-chart-2" />
                        Add Saving
                    </button>
                </div>
                <div className="m-10">
                    <div className='grid grid-cols-3 gap-10'>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-4'>
                                <div className='text-2xl text-blue-400'>${totalSavings.toFixed(2)}</div>
                                <div>Overall Savings</div>
                            </div>
                        </div>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-4'>
                                <div className='text-2xl text-purple-400'>${emergencyFundSavings.toFixed(2)}</div>
                                <div> Emergency Fund</div>
                            </div>
                        </div>
                        <div className='border border-sky-500 '>
                            <div className='flex flex-col text-center gap-4 p-4 '>
                                <div className='text-2xl text-pink-400'>${saving.toFixed(2)}</div>
                                <div> Savings </div>
                            </div>
                        </div>
                        <div className='border border-sky-500 '>
                            <div className='flex flex-col text-center gap-4 p-4 '>
                                <div className='text-2xl text-pink-400'>${extra.toFixed(2)}</div>
                                <div> Extra </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='m-10'>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Date Saved</th>
                                <th className="border w-1/4 border-gray-300 px-4 py-2">Category</th>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savings.map((saving) => (
                                <tr key={saving.id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(saving.date_saved).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td><td className="border border-gray-300 px-4 py-2">{saving.category}</td>
                                    <td className="border border-gray-300 px-4 py-2">{saving.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default SavingsPage