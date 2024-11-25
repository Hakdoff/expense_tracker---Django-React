import { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios"
import { jwtDecode } from 'jwt-decode'
import '../../src/index.css'
import AuthContext from "../context/AuthContext";
const swal = require('sweetalert2');

function NavBar() {
  const token = localStorage.getItem("authTokens");
  const [error, setError] = useState("");
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation()
  const { user, logoutUser } = useContext(AuthContext)
  const isActive = (path) => location.pathname === path;

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
  }, [authTokens, navigate]);

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
        <nav className="w-full bg-[#A594F9] h-full text-white p-10">
          <ul className="nav flex-column ">
            <span className=' text-center text-2xl font-bold pb-4  border-bottom'>
              Expense Tracker
            </span>
            <div className='py-10'>
              <div className="flex flex-col items-center justify-center">
                <img className='rounded-full w-32 h-32 xl:w-44 xl:h-44'
                  src="https://bobbyhadz.com/images/blog/react-prevent-multiple-button-clicks/thumbnail.webp"
                  alt="car"
                />
              </div>
              <div className='w-full border-bottom py-4 text-center'>
                <span className='text-[20px] font-bold '>
                  Hello {username}
                </span>
              </div>
            </div>
            <div className="text-start text-xl">
              <li className="py-2">
                <a className={`nav-link rounded-full text-start cursor-pointer hover:bg-[#6C48C5] w-full ${isActive("/") ? "bg-[#3B1E54]" : ""}`} onClick={() => navigate(`/`)}>
                  Dashboard
                </a>
              </li>
              <li className="py-2">
                <a className={`nav-link rounded-full text-start cursor-pointer hover:bg-[#6C48C5] w-full ${isActive("/income") ? "bg-[#3B1E54]" : ""}`} onClick={() => navigate(`/income`)}>
                  Income
                </a>
              </li>
              <li className="py-2">
                <a className={`nav-link rounded-full text-start cursor-pointer hover:bg-[#6C48C5] w-full ${isActive("/expenses") ? "bg-[#3B1E54]" : ""}`} onClick={() => navigate(`/expenses`)}>
                  Expenses
                </a>
              </li>
              <li className="py-2">
                <a className={`nav-link rounded-full text-start cursor-pointer hover:bg-[#6C48C5] w-full ${isActive("/savings") ? "bg-[#3B1E54]" : ""}`} onClick={() => navigate(`/savings`)}>
                  Savings
                </a>
              </li>
              <li className="py-2">
                <a className={`nav-link rounded-full text-start cursor-pointer hover:bg-[#6C48C5] w-full ${isActive("/bills") ? "bg-[#3B1E54]" : ""}`} onClick={() => navigate(`/bills`)}>
                  Bills
                </a>
              </li>
              <li className="py-2">
                <a className={`nav-link rounded-full text-start cursor-pointer hover:bg-[#6C48C5] w-full ${isActive("/wishlist") ? "bg-[#3B1E54]" : ""}`} onClick={() => navigate(`/wishlist`)}>
                  Wishlist
                </a>
              </li>
              {token !== null &&
                <>
                  <li class="py-2 ">
                    <a class="nav-link rounded-full cursor-pointer hover:bg-[#6C48C5]" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</a>
                  </li>
                </>
              }
            </div>
          </ul>
        </nav>
    </>
  )
}

export default NavBar