import React, { useContext, useState } from "react";
import eyeoff from "../../../../assets/icons/eye-off.svg";
import eye from "../../../../assets/icons/eye.svg";
import "./style.scss";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/authContext";
import useAxios from "../../../../utils/useAxios";
import { isPasswordValid } from "../../../../utils/validation";

const Password = () => {
  const { user, authTokens } = useContext(AuthContext);
  
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

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const axiosInstance = useAxios();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.current_password.trim()) {
      newErrors.current_password = "Current password cannot be empty";
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = "Password cannot be empty";
    } else if (!isPasswordValid(formData.new_password)) {
      newErrors.new_password =
        "Password must be at least 8 characters and contain at least one uppercase letter, one number and one special character.";
    }

    if (!formData.new_password_confirm.trim()) {
      newErrors.new_password_confirm = "Confirm password cannot be empty";
    } else if (formData.new_password !== formData.new_password_confirm) {
      newErrors.new_password_confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axiosInstance.put(
        `/user/change_password/${user.user_id}/`,
        formData
      );
      if (response.status === 200) {
        console.log("okey");
        toast.success("Password changed");
        setFormData({
          current_password: "",
          new_password: "",
          new_password_confirm: "",
        });
      } else {
        console.log(response.status);
        console.log("there was a server issue");
        toast.error("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="password_change">
        <div className="heading_text">
          <h1>Password</h1>
          <button onClick={handleSubmit} type="submit">
            Save
          </button>
        </div>
        <form className="reset_pass_form pt-5">
          <div className="input-data">
            <input
              type="text"
              required
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
            />
            <label>Current password</label>
          </div>
          <div className={errors.current_password ? "error" : ""}>
            {errors.current_password && (
              <>
                <i className="fas fa-exclamation-circle"></i>{" "}
                {errors.current_password}
              </>
            )}
          </div>
          <div className="input-data mt-4">
            <input
              type={showPassword.password1 ? "text" : "password"}
              required
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
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

          <div className="input-data mt-4">
            <input
              type={showPassword.password2 ? "text" : "password"}
              required
              name="new_password_confirm"
              onChange={handleChange}
              value={formData.new_password_confirm}
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
        </form>
      </div>
    </>
  );
};

export default Password;
