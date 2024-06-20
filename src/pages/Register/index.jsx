import React, { useContext, useState } from "react";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import { NavLink, useNavigate } from "react-router-dom";
import eyeoff from "../../assets/icons/eye-off.svg";
import eye from "../../assets/icons/eye.svg";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";
import { isPasswordValid } from "../../utils/validation";
const Register = () => {
  const [checked, setChecked] = useState(false);
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

  const navigate = useNavigate();

  const { registerUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Username cannot be empty";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "User last name cannot be empty";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password cannot be empty";
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain at least one uppercase letter, one number and one special character.";
    }

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords do not match";
    }
    if (!checked) {
      newErrors.checked = "Accept terms of use";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await toast.promise(registerUser(formData), {
        loading: "Processing...",
        success:
          "Registration Successful, Please Check Your Email and Verify Otp Code",
        error: (err) => {
          if (
            err.response &&
            err.response.status === 400 &&
            err.response.data.email
          ) {
            return "This email is already in use. Please use a different email.";
          } else if (
            err.response &&
            err.response.status === 400 &&
            err.response.data.username
          ) {
            return "This username is already taken. Please choose a different username.";
          }
          return "There was a server issue";
        },
      });

      if (response.status === 201) {
        console.log("okey");
        localStorage.setItem("email", formData.email);
        localStorage.setItem("context", "register");
        setFormData({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          password_confirm: "",
        });
        setChecked(false);
        navigate("/user/verify-otp");
      } else {
        console.log(response.status);
        console.log("there was a server issue");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="register">
      <div className="left"></div>
      <div className="right">
        <div className="logo mb-5">
          <img src={logo} alt="" />
        </div>
        <div className="right-content">
          <h5>Create new account</h5>
          <p>
            Don’t you have an account?{" "}
            <span>
              <NavLink to={"/login"}>Login</NavLink>
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmitRegister}>
          <div className="wrapper">
            <div className="input-data">
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={formData.username}
              />
              <label>Username</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.username && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.username}
                </>
              )}
            </div>

            <div className="input-data mt-5">
              <input
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
              />
              <label>First Name</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.first_name && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.first_name}
                </>
              )}
            </div>
            <div className="input-data mt-5">
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <label>Last Name</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.last_name && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.last_name}
                </>
              )}
            </div>
            <div className="input-data mt-5">
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={formData.email}
              />
              <label>E-mail address</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.email && (
                <>
                  <i className="fas fa-exclamation-circle"></i> {errors.email}
                </>
              )}
            </div>
            <div className="input-data mt-5">
              <input
                type={showPassword.password1 ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formData.password}
              />
              <div
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password1")}
              >
                <img src={showPassword.password1 ? eye : eyeoff} alt="" />
              </div>
              <label>Password</label>
            </div>
            <div className={errors.password ? "error" : ""}>
              {errors.password && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.password}
                </>
              )}
            </div>

            <div className="input-data mt-5">
              <input
                type={showPassword.password2 ? "text" : "password"}
                name="password_confirm"
                onChange={handleChange}
                value={formData.password_confirm}
              />
              <div
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password2")}
              >
                <img src={showPassword.password2 ? eye : eyeoff} alt="" />
              </div>
              <label>Confirm Password</label>
            </div>
            <div className={errors.password_confirm ? "error" : ""}>
              {errors.password_confirm && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.password_confirm}
                </>
              )}
            </div>
            <div className="pt-4 form-check">
              <div className="d-flex gap-2">
                <label className="checkbox-container d-flex">
                  <input
                    type="checkbox"
                    value={checked}
                    name="checked"
                    onChange={() => setChecked((state) => !state)}
                  />
                  <span className="checkmark me-2"></span>
                  <div>
                    By creating account, you agree our <a>Terms of use</a> and{" "}
                    <a>Privacy Policy</a>
                  </div>
                </label>
              </div>
            </div>
            <div className={errors.checked ? "error" : ""}>
              {errors.checked && (
                <>
                  <i className="fas fa-exclamation-circle"></i> {errors.checked}
                </>
              )}
            </div>

            <div className="pt-4">
              <button type="submit">Register</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
