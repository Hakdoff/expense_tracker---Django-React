import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = 'http://127.0.0.1:8000/api';

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers: { Authorization: `Bearer ${authTokens?.access}` }
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if (!authTokens) {
            return req;
        }

        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

        if (!isExpired) {
            return req;
        }

        try {
            const response = await axios.post(
                `${baseURL}/token/refresh/`, 
                { refresh: authTokens.refresh }
            );

            localStorage.setItem('authTokens', JSON.stringify(response.data));
            
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));

            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
        } catch (error) {
            localStorage.removeItem('authTokens');
            setAuthTokens(null);
            setUser(null);
            // Let the error propagate to be handled by the component
            throw error;
        }
    });

    // Add response interceptor to handle 401s
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('authTokens');
                setAuthTokens(null);
                setUser(null);
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;