import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/baseUrl";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/user_detail/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data", response.data);
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  };

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const registerUser = async (user) => {
    const response = await axios.post(`${BASE_URL}/user/register/`, user);
    console.log(response.data);
    console.log(response);
    return response;
  };

  const verifyOtp = async (otp_code, email) => {
    const response = await axios.post(`${BASE_URL}/user/verify_otp/`, {
      otp_code,
      email,
    });
    console.log(response.data);
    console.log(response);
    return response;
  };

  const resendOtp = async (email) => {
    const response = await axios.post(`${BASE_URL}/user/resend_otp/`, {
      email,
    });
    console.log(response.data);
    console.log(response);
    return response;
  };

  const confirmNewPassword = async (data) => {
    const response = await axios.post(`${BASE_URL}/user/reset_password/`, data);
    console.log(response.data);
    console.log(response);
    return response;
  };

  const loginUser = async (user) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login/`, user);
      console.log(response.data);
      if (response.status === 200) {
        console.log("Logged In");
        console.log(response);
        console.log(response.data);
        console.log(response.data.access);
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));
        localStorage.setItem("authTokens", JSON.stringify(response.data));
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
    localStorage.removeItem("authTokens");
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
