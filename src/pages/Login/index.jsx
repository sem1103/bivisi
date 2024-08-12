import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import eyeoff from "../../assets/icons/eye-off.svg";
import eye from "../../assets/icons/eye.svg";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../api/baseUrl";
import axios from "axios";
import Cookies from 'js-cookie';
import { useGoogleLogin } from '@react-oauth/google';
import { useFacebookLogin } from "facebook-oauth-react";




const Login = () => {
  const { loginUser, fetchGoogleUserDetails, fetchFaceboookUserDetails } = useContext(AuthContext);

  const [checked, setChecked] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };




  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Username and password cannot be empty");
      return;
    }
    try {
      const result = await loginUser(formData);
      console.log(result);
      toast
        .promise(Promise.resolve(result), {
          loading: "Logging in...",
          success: "Login successful. Redirecting...",
          error: "An error occurred while logging in",
        })
        .then(() => {
          navigate("/");
        });

    } catch (error) {
      navigate(error.message == 'Please verify your account with OTP.' ? '/re-register' : '/login')
      console.error("Login error:", error.message);
      toast.error(error.message);
    }
  };



  const googleLogin = useGoogleLogin({
    onSuccess: (authResponse) => {
      fetchGoogleUserDetails(authResponse)
      navigate('/');

    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const facebookLogin = useFacebookLogin({
    onSuccess: (authResponse) => {
      fetchFaceboookUserDetails(authResponse);
      navigate('/');
    }
  });




  return (
    <>
      <section className="login">
        <div className="left"></div>
        <div className="right">
          <div className="logo mb-5">
            <Link to='/'><img src={logo} alt="" /></Link>
          </div>
          <div className="right-content">
            <h5>Welcome back!</h5>
            <p>
              Don’t you have an account?{" "}
              <span>
                <NavLink to={"/register"}>Sign up</NavLink>
              </span>
            </p>
          </div>
          <div className="soc__login">
                <div className="google__login" >
                  {/* <button type="button" onClick={() => googleLogin()}>Sign in with Google 🚀 </button> */}

                 
                    <button type="button" onClick={() => googleLogin()}>
                      <div class="svg-wrapper-1" >
                        <div class="svg-wrapper">
                          <svg viewBox="0 0 48 48" width={18}>
                            <title>Google Logo</title>
                            <clipPath id="g">
                              <path
                                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                              ></path>
                            </clipPath>
                            <g clip-path="url(#g)" class="colors">
                              <path d="M0 37V11l17 13z" fill="#FBBC05"></path>
                              <path d="M0 11l17 13 7-6.1L48 14V0H0z" fill="#EA4335"></path>
                              <path d="M0 37l30-23 7.9 1L48 0v48H0z" fill="#34A853"></path>
                              <path d="M48 48L17 24l-4-3 35-10z" fill="#4285F4"></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div class="text">oogle</div>
                    </button>


                 

                </div>
                <div className="fb__login">
                  {/* <button type="button" onClick={() => facebookLogin()}>Sign in with Facebook 🚀 </button> */}
                  <button type="button" onClick={() => facebookLogin()}>
                    <div class="svg-wrapper-1" >
                      <div class="svg-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"> <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path> </svg>
                      </div>
                    </div>
                    <div class="text">acebook</div>
                  </button>


                </div>
              </div>
          <form onSubmit={handleSubmit}>
            <div className="wrapper">
              <div className="input-data">
                <input
                  type="text"
                  onChange={handleChange}
                  name="username"
                  value={formData.username}
                />
                <label>Username</label>
              </div>

              <div className="input-data mt-5">
                <input
                  type={showPassword.password2 ? "text" : "password"}
                  onChange={handleChange}
                  name="password"
                  value={formData.password}
                />
                <div
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("password2")}
                >
                  <img src={showPassword.password2 ? eye : eyeoff} alt="" />
                </div>
                <label>Password</label>
              </div>

              <div className="d-flex justify-content-between pt-4 form-remember">
                <div className="d-flex gap-2">
                  <label className="checkbox-container ">
                    <input
                      type="checkbox"
                      defaultChecked={checked}
                      onChange={() => setChecked((state) => !state)}
                    />
                    <span className="checkmark me-2"></span>
                    Remember me
                  </label>
                </div>
                <p className="mb-0">
                  <NavLink to={"/reset_password"}>
                    Forgot your password?
                  </NavLink>
                </p>
              </div>

             
              <div className="pt-4">
                <button type="submit">Login</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
