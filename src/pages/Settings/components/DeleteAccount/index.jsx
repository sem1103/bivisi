import React, { useState } from "react";
import "./style.scss";
import eyeoff from "../../../../assets/icons/eye-off.svg";
import eye from "../../../../assets/icons/eye.svg";
import "./style.scss";
import useAxios from "../../../../utils/useAxios";
import { Modal } from "antd";

const DeleteAccount = () => {
  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  const axiosInstance = useAxios();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const response = await toast.promise(
        axiosInstance.post("/user/delete_account/", {
          email: formData.email,
          password: formData.password,
        }),
        {
          loading: "Processing...",
          success: "Account successfully deleted",
          error: "Failed to delete account. Please try again later",
        }
      );
      console.log("Hesap başarıyla silindi:", response.data);
      setIsModalVisible(false);
      localStorage.clear();
    } catch (error) {
      console.error("Hesap silinirken bir hata oluştu:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    showModal();
  };

  return (
    <section className="delete_acc">
      <div className="heading_text">
        <h1>Password</h1>
      </div>
      <form className="reset_pass_form pt-5" onSubmit={handleSubmit}>
        <div className="input-data mt-2">
          <input type="email" className={formData.email ? 'active__input' : ''} required name="email" onChange={handleChange} />
          <label>Email</label>
        </div>
        <div className="input-data mt-2">
          <input
            type={showPassword.password1 ? "text" : "password"}
            required
            name="password"
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
          <label>Current Password</label>
        </div>
        <button type="submit">Delete</button>
      </form>
      <Modal
        title="Delete Account"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        
      >
        <p>Are you sure you want to delete your account?</p>
      </Modal>
    </section>
  );
};

export default DeleteAccount;
