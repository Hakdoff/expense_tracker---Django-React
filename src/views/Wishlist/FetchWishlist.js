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

const WishlistPage = () => {
    const api = useAxios();
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [wishlists, setWishlist] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.get("/wishlist/");
                setWishlist(response.data);
            } catch (error) {
                setError("Failed to fetch wishlists.");
                swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.detail || 'Failed to fetch wishlists.',
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

        fetchWishlist();
    }, [authTokens, navigate]);

    const getYearAndMonth = (dateString) => {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
        };
    }

    const totalWishlist = wishlists.reduce((sum, wishlist) => sum + (wishlist.price || 0), 0);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const formattedMonth = new Date().toLocaleString("en-US", { month: "long" });

    const yearlyWishlist = wishlists
        .filter((wishlist) => getYearAndMonth(wishlist.date_received).year === currentYear)
        .reduce((sum, wishlist) => sum + (wishlist.amount || 0), 0);

    const monthlyWishlist = wishlists
        .filter((wishlist) => getYearAndMonth(wishlist.date_received).month === currentMonth)
        .reduce((sum, wishlist) => sum + (wishlist.amount || 0), 0);


    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        )
    }

    const groupWishlistByCategory = (wishlists) => {
        return wishlists.reduce((acc, wishlist) => {
            const category = wishlist.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + (wishlist.amount || 0);
            return acc;
        }, {});
    };

    const categoryData = groupWishlistByCategory(wishlists);
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
            <div className="bg-white p-4">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                    <div className="h2">Wishlist</div>
                    <button className="nav-link" onClick={() => navigate(`/addwishlist`)}>
                        <span data-feather="bar-chart-2" />
                        Add Wishlist
                    </button>
                </div>
                <div className="m-10">
                    <div className='grid grid-cols-1 gap-10'>
                        <div className='border border-sky-500'>
                            <div className='flex flex-col text-center gap-4 p-4'>
                                <div className='text-2xl text-blue-400'>${totalWishlist.toFixed(2)}</div>
                                <div>Overall Wishlist</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='m-10'>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Item</th>
                                    <th className="border border-gray-300 px-4 py-2">Category</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">Price</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlists.map((wishlist) => (
                                    <tr key={wishlist.id}>
                                        <td className="border border-gray-300 px-4 py-2">{wishlist.item}</td>
                                        <td className="border border-gray-300 px-4 py-2">{wishlist.category || "N/A"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{wishlist.description}</td>
                                        <td className="border border-gray-300 px-4 py-2">{wishlist.price}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {wishlist.is_bought ? (
                                                <span className="text-green-500">Bought</span>
                                            ) : (
                                                <span className="text-red-500">Not Yet</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}

export default WishlistPage