import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/baseUrl";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    Cookies.get('authTokens')
      ? JSON.parse(Cookies.get('authTokens'))
      : null
  );
  const [user, setUser] = useState(
    Cookies.get('authTokens')
      ? jwtDecode(Cookies.get('authTokens'))
      : null
  );


  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/user_detail/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  };

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const registerUser = async (user) => {
    const response = await axios.post(`${BASE_URL}/user/register/`, user);
    return response;
  };

  const verifyOtp = async (otp_code, email) => {
    const response = await axios.post(`${BASE_URL}/user/verify_otp/`, {
      otp_code,
      email,
    });
    return response;
  };

  const resendOtp = async (email) => {
    const response = await axios.post(`${BASE_URL}/user/resend_otp/`, {
      email,
    });
    return response;
  };

  const confirmNewPassword = async (data) => {
    const response = await axios.post(`${BASE_URL}/user/reset_password/`, data);
    return response;
  };

  const loginUser = async (user) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login/`, user);
      if (response.status === 200) {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));
        
        
        Cookies.set('authTokens', JSON.stringify(response.data), { expires: 14, path: '/', secure: true, sameSite: 'Strict' });
        await fetchUserDetails(response.data.access);
        return response.data;
      }
    } catch (error) {
      if (error.response.status === 404) {
        return false;
      } else {
        throw new Error("User not found or incorrect credentials");
      }
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setUserDetails(null);
    Cookies.remove('authTokens', { path: '/' })
    // localStorage.removeItem('wishlist')
    window.location.assign("/login");
    window.location.reload()
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    verifyOtp,
    logoutUser,
    resendOtp,
    confirmNewPassword,
    userDetails,
    setUserDetails,
    fetchUserDetails,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
      fetchUserDetails(authTokens.access);
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
