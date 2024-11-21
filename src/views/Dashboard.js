import { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import '../../src/index.css'
import AuthContext from "../context/AuthContext";

const swal = require('sweetalert2');

function Dashboard() {
  const api = useAxios();
  const token = localStorage.getItem("authTokens");
  const [incomes, setIncomes] = useState([]);
  const [error, setError] = useState("");
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  


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

    fetchIncomes();
  }, [authTokens, navigate]);

  const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);


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
                  <div className='text-2xl text-purple-400'>${totalIncome.toFixed(2)}</div>
                  <div>Expense</div>
                </div>
              </div>
              <div className='border border-sky-500 '>
                <div className='flex flex-col text-center gap-4 p-4 '>
                  <div className='text-2xl text-pink-400'>${totalIncome.toFixed(2)}</div>
                  <div>Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>


  )
}

export default Dashboard