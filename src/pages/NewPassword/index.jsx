import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoLight.svg";
import eyeoff from "../../assets/icons/eye-off.svg";
import eye from "../../assets/icons/eye.svg";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { isPasswordValid } from "../../utils/validation";
const NewPassword = () => {
  const { confirmNewPassword } = useContext(AuthContext);
  const [new_password_confirm, setNew_password_confirm] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    otp_code: "",
  });

  const updateOtpCode = () => {
    const otp_code = JSON.parse(localStorage.getItem("otp"));
    setFormData((prevState) => ({
      ...prevState,
      otp_code: otp_code,
    }));
  };

  useEffect(() => {
    updateOtpCode()
  }, []);

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
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = "Password cannot be empty";
    } else if (!isPasswordValid(formData.new_password)) {
      newErrors.new_password =
        "Password must be at least 8 characters and contain at least one uppercase letter, one number and one special character.";
    }

    if (formData.new_password !== new_password_confirm) {
      newErrors.new_password_confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await confirmNewPassword(formData);
      if (response.status === 200) {
        console.log("okey");
        toast.success("Change Password Successful, Login Now");
        navigate("/login");
      } else {
        console.log(response.status);
        console.log("there was a server issue");
        toast.error("Error");
      }
    } catch (error) {
      console.log(error);
      toast.error("There is a mistake in the email");
    }
  };
  return (
    <>
      <section className="register">
        <div className="left"></div>
        <div className="right">
          <div className="logo mb-5">
            <img src={logo} alt="" />
          </div>
          <div className="right-content">
            <h1>Reset password</h1>
            <p>
              Got your password? <a href="/login">Log In</a>
            </p>
          </div>

          <form onSubmit={handleSubmitNewPassword}>
            <div className="wrapper">
              <div className="input-data mt-5">
                <input
                  type="email"
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
                  name="new_password"
                  onChange={handleChange}
                  value={formData.new_password}
                />
                <div
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("password1")}
                >
                  <img src={showPassword.password1 ? eye : eyeoff} alt="" />
                </div>
                <label>Password</label>
              </div>
              <div className={errors.new_password ? "error" : ""}>
                {errors.new_password && (
                  <>
                    <i className="fas fa-exclamation-circle"></i>{" "}
                    {errors.new_password}
                  </>
                )}
              </div>

              <div className="input-data mt-5">
                <input
                  type={showPassword.password2 ? "text" : "password"}
                  name="new_password_confirm"
                  onChange={(e) => setNew_password_confirm(e.target.value)}
                  value={new_password_confirm}
                />
                <div
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility("password2")}
                >
                  <img src={showPassword.password2 ? eye : eyeoff} alt="" />
                </div>
                <label>Confirm Password</label>
              </div>
              <div className={errors.new_password_confirm ? "error" : ""}>
                {errors.new_password_confirm && (
                  <>
                    <i className="fas fa-exclamation-circle"></i>{" "}
                    {errors.new_password_confirm}
                  </>
                )}
              </div>

              <div className="pt-4">
                <button type="submit">Confirm</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default NewPassword;
