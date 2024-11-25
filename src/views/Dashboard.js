import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import '../../src/index.css'
import AuthContext from "../context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import BillsPage from './Bills/FetchBills';
import WishlistPage from './Wishlist/FetchWishlist';

const swal = require('sweetalert2');

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


  if (token) {
    const decode = jwtDecode(token)
    var user_id = decode.user_id
    var username = decode.username
    var full_name = decode.full_name
    var image = decode.image

  }


  useEffect(() => {
    if (!authTokens) {
      navigate('/login');
      return;
    }
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

    fetchIncomes();
    fetchSavings();
    fetchExpenses();
  }, [authTokens, navigate]);

  const totalSavings = savings.reduce((sum, saving) => sum + (saving.amount || 0), 0);
  const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    )
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

  const monthlyIncome = incomes.length ? groupByMonth(incomes) : Array(12).fill(0);
  const monthlyExpenses = expenses.length ? groupByMonth(expenses) : Array(12).fill(0);


  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: monthlyIncome,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: monthlyExpenses,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Income and Expenses",
      },
    },
  };

  return (
    <>
      <div className="  bg-white">
        <div className='m-4'>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <div className="h2">Dashboard</div>
          </div>
          <div className="m-10">
            <div className='grid grid-cols-3  gap-10'>
              <div className='border border-sky-500'>
                <div className='flex flex-col text-center gap-4 p-4'>
                  <div className='text-2xl text-blue-400'>${totalIncome.toFixed(2)}</div>
                  <div>Income</div>
                </div>
              </div>
              <div className='border border-sky-500'>
                <div className='flex flex-col text-center gap-4 p-4'>
                  <div className='text-2xl text-purple-400'>${totalExpenses.toFixed(2)}</div>
                  <div>Expenses</div>
                </div>
              </div>
              <div className='border border-sky-500 '>
                <div className='flex flex-col text-center gap-4 p-4 '>
                  <div className='text-2xl text-pink-400'>${totalSavings.toFixed(2)}</div>
                  <div>Savings</div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex m-3 md:flex-col'>
            <div className='border m-4' >
              <BillsPage></BillsPage>
            </div>
            <div className='border m-4' >
              <WishlistPage></WishlistPage>
            </div>
          </div>


        </div>
      </div>

    </>


  )
}

export default Dashboard