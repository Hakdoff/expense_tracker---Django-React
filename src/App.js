import { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/privateRoutes";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./views/Dashboard";
import NavBar from "./views/Navbar";
import LoginPage from "./views/Auth/LoginPage";
import RegisterPage from "./views/Auth/RegisterPage";
import AddIncomePage from "./views/Income/AddIncome";
import IncomePage from "./views/Income/FetchIncome";
import FetchIncomeByIncome from "./views/Income/FetchIncomeByID";


function App() {
  const [token, setToken] = useState(localStorage.getItem("authTokens"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("authTokens"));
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        {token == null ? (
          <>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </>
        ) : (
          <div className="bg-[#A594F9]">
            <div className="flex">
              <div className="w-1/4 xl:w-1/6">
              <div className='fixed w-1/4 xl:w-1/6'>
                <NavBar></NavBar>
                </div>
              </div>
              <div className="w-3/4 xl:w-5/6  bg-white">
                <div className='m-4'>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/addincome/" element={<AddIncomePage />} />
                    <Route path="/income/" element={<IncomePage />} />
                    <Route path="/income/:id" element={<FetchIncomeByIncome />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </AuthProvider>
    </Router>
  );
}

export default App;