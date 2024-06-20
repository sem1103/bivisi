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
      <form className="reset_pass_form" onSubmit={handleSubmit}>
        <div className="input-data mt-2">
          <input type="email" required name="email" onChange={handleChange} />
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
            <img src={showPassword.password1 ? eye : eyeoff} alt="" />
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
