import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
const swal = require('sweetalert2');

const FetchIncomeByIncome = () => {
    const { id } = useParams();
    const api = useAxios();
    const navigate = useNavigate();
    const { authTokens } = useContext(AuthContext);
    const [income, setIncome] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const response = await api.get(`/income/${id}/`);
                setIncome(response.data);
            } catch (error) {
                setError("Failed to fetch income details.");
                swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch income details.',
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
                if (error.reponse?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchIncome();

        if (!authTokens) {
            navigate('/login');
        }
    }, [id, authTokens, navigate]);

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            </div>
        );
    }

    
    if (!income) {
        return (
            <div className="text-center mt-8">
                <p>Loading income details...</p>
            </div>
        );
    }

    return (
        <>
            
            <div className="max-w-md mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Income Details</h1>
                <p><strong>Amount:</strong> {income.amount}</p>
                <p><strong>Description:</strong> {income.description || "No description provided"}</p>
                <p><strong>Date Received:</strong> {new Date(income.date_received).toLocaleString()}</p>
                <button
                        onClick={() => navigate(`/editincome/${income.id}`)}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-4"
                    >
                        Edit
                    </button>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Back to Dashboard
                </button>
            </div>
        </>
    )
}

export default FetchIncomeByIncome;