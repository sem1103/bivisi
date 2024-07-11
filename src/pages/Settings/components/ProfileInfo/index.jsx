import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import profile from "../../../../assets/images/avatar.svg";
import edit from "../../../../assets/icons/edit-bg.svg";
import useAxios from "../../../../utils/useAxios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../../context/authContext";

const ProfileInformation = () => {
  const axiosInstance = useAxios();
  const { userDetails, fetchUserDetails, authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: userDetails?.first_name,
    last_name: userDetails.last_name,
    bio: "",
    facebook: "",
    twitter: "",
    instagram: "",
    cover_image: null,
    avatar: null,
  });

  const [preview, setPreview] = useState({
    cover_image: "",
    avatar: "",
  });

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (userDetails) {
      const initialFormData = {
        first_name: userDetails.first_name || "",
        last_name: userDetails.last_name || "",
        bio: userDetails.bio || "",
        facebook: userDetails.facebook || "",
        twitter: userDetails.twitter || "",
        instagram: userDetails.instagram || "",
        cover_image: null,
        avatar: null,
      };
      setFormData(initialFormData);
      setInitialData(initialFormData);
      setPreview({
        cover_image: userDetails.cover_image || "",
        avatar: userDetails.avatar || "",
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));

    if (name === "cover_image" || name === "avatar") {
      if (!isValidImageFile(file)) {
        toast.error("Invalid file type. Please select a valid image file.");
        return;
      }
      setPreview((prevPreview) => ({
        ...prevPreview,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const hasChanges = () => {
    if (!initialData) return false;
    for (const key in formData) {
      if (formData[key] !== initialData[key]) {
        return true;
      }
    }
    return false;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isValidImageFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    return validTypes.includes(file.type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges()) {
      toast.error("No changes to save.");
      return;
    }

    if (formData.facebook && !isValidUrl(formData.facebook)) {
      toast.warning("Please enter a valid Facebook URL.");
      return;
    }
    if (formData.instagram && !isValidUrl(formData.instagram)) {
      toast.warning("Please enter a valid Instagram URL.");
      return;
    }
    if (formData.twitter && !isValidUrl(formData.twitter)) {
      toast.warning("Please enter a valid Twitter URL.");
      return;
    }
    if (formData.cover_image && !isValidImageFile(formData.cover_image)) {
      toast.warning("Invalid file type for cover image. Please select a valid image file.");
      return;
    }
    if (formData.avatar && !isValidImageFile(formData.avatar)) {
      toast.warning("Invalid file type for avatar. Please select a valid image file.");
      return;
    }

    const updateProfile = async () => {
      try {
        const response = await axiosInstance.put(
          "/user/profile_information/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Profile updated successfully:", response.data);
        let authTokens = JSON.parse(localStorage.authTokens);
        localStorage.setItem('authTokens', JSON.stringify({
          ...authTokens,
          first_name:  response.data.first_name,
          last_name : response.data.last_name
        }))

        fetchUserDetails(authTokens.access);
        return response.data;
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    };
    toast.promise(updateProfile(), {
      pending: "Updating profile...",
      success: "Profile updated successfully!",
      error: "Error updating profile.",
    });
  };

  return (
    <form className="profile_information" onSubmit={handleSubmit}>
      <div className="heading_text">
        <h1>Profile information</h1>
        <button type="submit">Save</button>
      </div>

      <div className="profileinfo_section pt-5">
        <div
          className="profileinfo_bg_image"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.28) 100%), url(${
              preview.cover_image || formData.cover_image
            })`,
          }}
        >
          <input
            type="file"
            name="cover_image"
            id="cover_image"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <img
            src={edit}
            alt=""
            className="edit_icon_bg"
            onClick={() => document.getElementById("cover_image").click()}
          />
        </div>
        <div className="profile_info">
          <div
            className="profile_img_content"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.54) 0%, rgba(0, 0, 0, 0.54) 100%),url(${
                preview.avatar || formData.avatar
              })`,
            }}
          >
            <img
              src={edit}
              alt=""
              className="edit_icon"
              onClick={() => document.getElementById("avatar").click()}
            />
            <input
              className="profile_img"
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="container">
          <div className="profileinfo_form">
            <div className="row">
              <div className="col-lg-6">
                <div className="d-flex flex-column input-data">
                  <label>First Name</label>
                  <input
                    placeholder="First Name"
                    type="text"
                    className="mt-2"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="d-flex flex-column input-data">
                  <label>Last Name</label>
                  <input
                    placeholder="Last Name"
                    type="text"
                    className="mt-2"
                    name="last_name"
                    onChange={handleChange}
                    value={formData.last_name}
                  />
                </div>
              </div>

              <div className="col-lg-12 mt-3">
                <div className="d-flex flex-column input-data">
                  <label>About</label>
                  <textarea
                    placeholder="About you"
                    rows="4"
                    className="mt-2"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-6 mt-3">
                <div className="d-flex flex-column input-data">
                  <label>Facebook</label>
                  <input
                    placeholder="Facebook"
                    type="text"
                    className="mt-2"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-6 mt-3">
                <div className="d-flex flex-column input-data">
                  <label>Instagram</label>
                  <input
                    placeholder="Instagram"
                    type="text"
                    className="mt-2"
                    name="instagram"
                    onChange={handleChange}
                    value={formData.instagram}
                  />
                </div>
              </div>

              <div className="col-lg-6 mt-3">
                <div className="d-flex flex-column input-data">
                  <label>Twitter</label>
                  <input
                    placeholder="Twitter"
                    type="text"
                    className="mt-2"
                    name="twitter"
                    onChange={handleChange}
                    value={formData.twitter}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileInformation;
