import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export const baseURL = "http://64.226.112.70/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(authTokens?.access);
    const isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    console.log(user);
    console.log(isExpired);

    const response = await axios.post(`${baseURL}/user/login/refresh/`, {
      refresh: authTokens.refresh,
    });
    localStorage.setItem("authTokens", JSON.stringify(response.data));
    localStorage.setItem("authTokens", JSON.stringify(response.data));

    setAuthTokens(response.data);
    setUser(jwtDecode(response.data.access));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;
