import React, { useContext, useState } from "react";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/baseUrl";
import Cookies from 'js-cookie';


const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.warning("Please enter your email");
    } else if (!emailPattern.test(email)) {
      toast.warning("Please enter a valid email address");
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/send_email_reset_password/`,
          { email }
        );
        
        if (response.status === 200) {
          toast.success("Please check your email");
          setEmail("");
          localStorage.setItem("context", "forgot-password");
          Cookies.set('email', email, { expires: 1, path: '/', secure: true, sameSite: 'Strict' });
          navigate("/user/verify-otp");

        } else {
          toast.error("An error occurred");
          
        }
      } catch (error) {
        console.log(error);
        
        if (error.response) {
          if (error.response.status === 400) {
            toast.error("Invalid email address or user not found");
          } else {
            toast.error("An error occurred:");
          }
        } else {
          toast.error("An error occurreds:");
        }
      }
    }
  };

  return (
    <section className="reset">
      <div className="left"></div>
      <div className="right">
        <div className="logo mb-5">
          <img src={logo} alt="" />
        </div>
        <div className="right-content">
          <h5>Reset password</h5>
          <p>
            Got your password?{" "}
            <span>
              <NavLink to={"/login"}>Login</NavLink>
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="wrapper">
            <div className="input-data">
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <label>E-mail address</label>
            </div>

            <div className="pt-4">
              <button type="submit">Request my password</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
