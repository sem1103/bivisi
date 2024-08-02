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
            autocomplete="off"
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
            autocomplete="off"
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
              {showPassword.password1 ? 
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Eye/Solid">
<path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.6084 11.7892C18.5748 10.7724 18.5748 9.22772 17.6084 8.211C15.9786 6.49619 13.1794 4.16675 9.99984 4.16675C6.82024 4.16675 4.02108 6.49619 2.39126 8.211C1.42492 9.22772 1.42492 10.7724 2.39126 11.7892C4.02108 13.504 6.82024 15.8334 9.99984 15.8334C13.1794 15.8334 15.9786 13.504 17.6084 11.7892ZM9.99984 12.5001C11.3805 12.5001 12.4998 11.3808 12.4998 10.0001C12.4998 8.61937 11.3805 7.50008 9.99984 7.50008C8.61913 7.50008 7.49984 8.61937 7.49984 10.0001C7.49984 11.3808 8.61913 12.5001 9.99984 12.5001Z" fill="white"/>
</g>
</svg>

 : 
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Eye/Off">
<path id="Vector" d="M3.33366 3.33337L16.667 16.6667M11.667 11.8635C11.2247 12.2593 10.6406 12.5 10.0003 12.5C8.61961 12.5 7.50033 11.3808 7.50033 10C7.50033 9.35975 7.74104 8.77567 8.1369 8.33337M16.3401 13.0065C16.8163 12.5919 17.2422 12.175 17.6089 11.7891C18.5752 10.7724 18.5752 9.22768 17.6089 8.21096C15.9791 6.49615 13.1799 4.16671 10.0003 4.16671C9.25751 4.16671 8.53547 4.29384 7.84424 4.51057M5.41699 5.66953C4.20152 6.44541 3.16502 7.39736 2.39175 8.21096C1.42541 9.22768 1.42541 10.7724 2.39175 11.7891C4.02157 13.5039 6.82073 15.8334 10.0003 15.8334C11.5571 15.8334 13.0226 15.275 14.3044 14.5037" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>
}
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
            autocomplete="off"
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
{showPassword.password2 ? 
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Eye/Solid">
<path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.6084 11.7892C18.5748 10.7724 18.5748 9.22772 17.6084 8.211C15.9786 6.49619 13.1794 4.16675 9.99984 4.16675C6.82024 4.16675 4.02108 6.49619 2.39126 8.211C1.42492 9.22772 1.42492 10.7724 2.39126 11.7892C4.02108 13.504 6.82024 15.8334 9.99984 15.8334C13.1794 15.8334 15.9786 13.504 17.6084 11.7892ZM9.99984 12.5001C11.3805 12.5001 12.4998 11.3808 12.4998 10.0001C12.4998 8.61937 11.3805 7.50008 9.99984 7.50008C8.61913 7.50008 7.49984 8.61937 7.49984 10.0001C7.49984 11.3808 8.61913 12.5001 9.99984 12.5001Z" fill="white"/>
</g>
</svg>

 : 
 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Eye/Off">
<path id="Vector" d="M3.33366 3.33337L16.667 16.6667M11.667 11.8635C11.2247 12.2593 10.6406 12.5 10.0003 12.5C8.61961 12.5 7.50033 11.3808 7.50033 10C7.50033 9.35975 7.74104 8.77567 8.1369 8.33337M16.3401 13.0065C16.8163 12.5919 17.2422 12.175 17.6089 11.7891C18.5752 10.7724 18.5752 9.22768 17.6089 8.21096C15.9791 6.49615 13.1799 4.16671 10.0003 4.16671C9.25751 4.16671 8.53547 4.29384 7.84424 4.51057M5.41699 5.66953C4.20152 6.44541 3.16502 7.39736 2.39175 8.21096C1.42541 9.22768 1.42541 10.7724 2.39175 11.7891C4.02157 13.5039 6.82073 15.8334 10.0003 15.8334C11.5571 15.8334 13.0226 15.275 14.3044 14.5037" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>
}            </div>
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
