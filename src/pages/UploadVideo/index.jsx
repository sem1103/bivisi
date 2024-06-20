import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { Progress, Select } from "antd";
import dollar from "../../assets/icons/dollar.svg";
import down_arrow from "../../assets/icons/down-arrow.svg";
import axios from "axios";
import useAxios from "../../utils/useAxios";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { ProductContext } from "../../context/ProductContext";
import { capitalizeFirstLetter } from "../../utils/validation";
import { FaCheck } from "react-icons/fa";

const UploadV = () => {
  const { product, setProduct } = useContext(ProductContext);
  const { Option } = Select;
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cover_image: null,
    category: [], // İndi bu bir massiv olacaq
    phone_number: "+994", // Default country code
    product_type: "Video",
    price: "",
    original_video: null,
  });
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(
          "http://64.226.112.70/api/categories/"
        );
        console.log("video upload", categoryRes.data.results);
        setCategory(categoryRes.data.results);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" && isNaN(value)) {
      toast.warning("Please enter a valid numeric value for price.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));

    if (name === "original_video") {
      setVideoPreview(null); // Reset the video preview
      setLoadingProgress(0); // Reset progress
      setShowProgressBar(true); // Show progress bar

      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);

      const updateProgress = (percent) => {
        setLoadingProgress(percent);
        if (percent === 100) {
          setVideoPreview(video.src);
          setShowProgressBar(false); // Hide progress bar after completion
        }
      };

      video.onloadeddata = () => {
        const middleTime = video.duration / 2;
        video.currentTime = middleTime;
        video.onseeked = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            const coverImageFile = new File([blob], "thumbnail.jpg", {
              type: "image/jpeg",
            });
            setFormData((prevData) => ({
              ...prevData,
              cover_image: coverImageFile,
            }));
          }, "image/jpeg");

          // Simulate loading progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            updateProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 500); // Adjust the interval time for desired speed
        };
      };
    }
  };

  const renderCategories = (categories) => {
    return categories?.map((item) => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ));
  };

  const handleSelectChange = (name, value) => {
    if (name === "category") {
      const selectedCategory = category.find((cat) => cat.id === value);
      setSubcategory(selectedCategory?.children || []);
      setFormData((prevData) => ({
        ...prevData,
        category: [value, ""], // İkinci elementi təmizləyin
      }));
    } else if (name === "subcategory") {
      setFormData((prevData) => ({
        ...prevData,
        category: [prevData.category[0], value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0) {
      return [
        <Option key="no-data" disabled>
          Məlumat Yoxdur
        </Option>,
      ];
    }
    return subcategories.map((subcategory) => (
      <Option key={subcategory.id} value={subcategory.id}>
        {subcategory.name}
      </Option>
    ));
  };

  const validateForm = () => {
    const { name, description, phone_number, category, price, original_video } =
      formData;
    const isCategoryValid = category.length >= 1 && category[0];

    if (
      !name.trim() ||
      !description.trim() ||
      !phone_number.trim() ||
      !isCategoryValid ||
      !price.trim() ||
      !original_video
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "category") {
        // Ana və alt kateqoriyanın indekslərini birlikdə göndər
        formData[key].forEach((categoryId) => {
          submitData.append("category", categoryId);
        });
      } else if (key === "cover_image" && formData[key]) {
        submitData.append(key, formData[key], formData[key].name);
      } else {
        submitData.append(key, formData[key]);
      }
    });

    submitData.set("name", capitalizeFirstLetter(formData.name));
    submitData.set("description", capitalizeFirstLetter(formData.description));
    try {
      await toast.promise(
        axiosInstance.post(`/upload_product/`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Processing...",
          success: "Upload successful!",
          error: "Error uploading data",
        }
      );

      setFormData({
        name: "",
        description: "",
        cover_image: null,
        category: [],
        phone_number: "+994", // Reset country code
        product_type: "Video",
        price: "",
        original_video: null,
      });
      setVideoPreview(null);
    } catch (error) {
      console.error("Error uploading data", error);
      toast.error("An error occurred during upload.");
    }
  };

  return (
    <div className="upload_video">
      <div className="container-fluid upload_video_content mt-5">
        <div className="line"></div>
        <form onSubmit={handleSubmit} className="row pt-1">
          <div className="col-lg-6">
            <div
              className="pt-2 pb-3 d-flex gap-2 flex-column-reverse  align-items-center justify-content-center"
              style={{ width: "60%" }}
            >
              <h3>New Video</h3>
              <span className="completed_part">
                <div
                  className="white_part"
                  style={{ display: `${videoPreview ? "none" : "block"}` }}
                ></div>
                <FaCheck
                  style={{ display: `${videoPreview ? "block" : "none"}` }}
                />
              </span>
            </div>

            <div className="select_video">
              <p>Drag and drop video files to upload</p>
              {showProgressBar && (
                <div className="progress-container">
                  <Progress type="circle" percent={loadingProgress} />
                </div>
              )}
              {videoPreview && (
                <ReactPlayer
                  className="video_previev"
                  controls
                  url={videoPreview}
                  style={{ width: "100%" }}
                />
              )}
              <input
                type="file"
                name="original_video"
                id="original_video"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("original_video").click()
                }
              >
                Select file
              </button>
            </div>
          </div>
          <div
            className={`col-lg-6 select_form ${
              !videoPreview ? "disabled" : ""
            }`}
          >
            <div
              className="pt-2 pb-3 d-flex gap-2 flex-column-reverse  align-items-center justify-content-center"
              style={{ width: "100%" }}
            >
              <h3>Details</h3>
              <span className="completed_part">
                <div
                  className="white_part"
                  style={{ display: `${validateForm() ? "none" : "block"}` }}
                ></div>
                <FaCheck
                  style={{ display: `${validateForm() ? "block" : "none"}` }}
                />
              </span>
            </div>

            <div className="input_data">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="input_data">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="input_data">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+994"
              />
            </div>

            <div className="input_data">
              <label htmlFor="category">Category</label>
              <div className="custom-select">
                <Select
                  value={formData.category[0]}
                  onChange={(value) => handleSelectChange("category", value)}
                  className="select"
                  popupClassName="custom-dropdown"
                  suffixIcon={<img src={down_arrow} alt="Dropdown Arrow" />}
                >
                  {renderCategories(category)}
                </Select>
              </div>
            </div>

            <div className="input_data">
              <label htmlFor="subcategory">Subcategory</label>
              <div className="custom-select">
                <Select
                  value={formData.category[1]}
                  onChange={(value) => handleSelectChange("subcategory", value)}
                  className="select"
                  popupClassName="custom-dropdown"
                  suffixIcon={<img src={down_arrow} alt="Dropdown Arrow" />}
                  notFoundContent="Məlumat Yoxdur"
                >
                  {renderSubcategories(subcategory)}
                </Select>
              </div>
            </div>

            <div className="input_data">
              <label htmlFor="price">Price</label>
              <div className="file_price">
                <img src={dollar} alt="Dollar" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadV;
