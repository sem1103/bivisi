import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  if (user) {
    return <Outlet />;
  } else {
    return <Navigate to={"/login"} />;
  }

  // let auth = { token: false };
  // return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
