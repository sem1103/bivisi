import React, { useContext, useState } from "react";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import eyeoff from "../../assets/icons/eye-off.svg";
import eye from "../../assets/icons/eye.svg";
import toast from "react-hot-toast";
const Login = () => {
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

  const { loginUser, setAuthTokens, setUser } = useContext(AuthContext);

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
