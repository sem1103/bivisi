import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { Select } from "antd";
import useAxios from "../../../../utils/useAxios";
import { AuthContext } from "../../../../context/authContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

const General = () => {
  const { userDetails, fetchUserDetails, authTokens } = useContext(AuthContext);
  const axiosInstance = useAxios();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    birthday: new Date(),
    gender: "",
  });

  useEffect(() => {
    if (userDetails) {
      setFormData({
        username: userDetails.username || "",
        email: userDetails.email || "",
        birthday: userDetails.birthday
          ? new Date(userDetails.birthday)
          : new Date(),
        gender: userDetails.gender || "",
      });
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birthday: date,
    });
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      birthday: moment(formData.birthday).format("YYYY-MM-DD"),
    };

    const updateProfile = async () => {
      const response = await axiosInstance.put(
        "/user/general_settings/",
        formattedData
      );
      return response;
    };

    toast
      .promise(updateProfile(), {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Error updating profile",
      })
      .then(() => {
        fetchUserDetails(authTokens.access);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <>
      <form className="general_settings" onSubmit={handleSubmit}>
        <div className="heading_text">
          <h1>General Settings</h1>
          <button type="submit">Save</button>
        </div>

        <div className="container pt-5">
          <div className="general_form">
            <div className="row row-gap-3">
              <div className="col-lg-6">
                <div className="d-flex flex-column input-data">
                  <label>Username</label>
                  <input
                    type="text"
                    className="mt-2"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex flex-column input-data">
                  <label>E-mail address</label>
                  <input
                    type="email"
                    className="mt-2"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex flex-column input-data">
                  <label>Birthday</label>
                  <DatePicker
                    selected={formData.birthday}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex flex-column input-data">
                  <label>Gender</label>
                  <Select
                    value={formData.gender}
                    onChange={handleGenderChange}
                    className="mt-2 form_select"
                    options={[
                      { value: "Female", label: "Female" },
                      { value: "Male", label: "Male" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default General;
