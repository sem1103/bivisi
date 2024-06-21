import React, { useEffect, useState } from "react";
import "./style.scss";
import upload from "../../assets/icons/upload-gray.svg";
import { Progress, Select } from "antd";
import dollar from "../../assets/icons/dollar.svg";
import down_arrow from "../../assets/icons/down-arrow.svg";
import axios from "axios";
import useAxios from "../../utils/useAxios";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { capitalizeFirstLetter } from "../../utils/validation";
import { FaCheck } from "react-icons/fa";

const UploadS = ({ productId, type }) => {
  const { Option } = Select;
  const [category, setCategory] = useState([]);
  const axiosInstance = useAxios();
  const [subcategory, setSubcategory] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [a, b] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cover_image: null,
    category: [],
    phone_number: "+994",
    product_type: type ? type : "Shorts",
    price: "",
    original_video: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      setVideoPreview(null);
      setLoadingProgress(0);
      setShowProgressBar(true);

      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);

      const updateProgress = (percent) => {
        setLoadingProgress(percent);
        if (percent === 100) {
          setVideoPreview(video.src);
          setShowProgressBar(false);
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

          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            updateProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 500);
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
        category: [value, ""],
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
        formData[key].forEach((categoryId) => {
          submitData.append("category", categoryId);
        });
      } else if (key === "cover_image" && formData[key]) {
        if (!productId) {
          submitData.append("cover_image", formData[key]);
        }
      } else if (key === "original_video" && formData[key]) {
        if (!productId) {
          submitData.append("original_video", formData[key]);
        }
      } else {
        submitData.append(key, formData[key]);
      }
      console.log(submitData);
    });

    submitData.set("name", capitalizeFirstLetter(formData.name));
    submitData.set("description", capitalizeFirstLetter(formData.description));
    console.log(formData);
    try {
      console.log(submitData);
      const response = await toast.promise(
        productId
          ? axiosInstance.put(
              `/update_product/${productId}/${a.product_video_type[0].id}/`,
              submitData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          : axiosInstance.post(`/upload_product/`, submitData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }),
        {
          loading: "Processing...",
          success: productId ? "Update successful!" : "Upload successful!",
          error: "Error uploading data",
        }
      );

      if (!productId) {
        setFormData({
          name: "",
          description: "",
          cover_image: null,
          category: [],
          phone_number: "+994",
          product_type: "Shorts",
          price: "",
          original_video: null,
        });
        setVideoPreview(null);
      }
    } catch (error) {
      console.error("Error uploading data", error);
      toast.error("An error occurred during upload.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(
          "http://64.226.112.70/api/categories/"
        );
        setCategory(categoryRes.data.results);

        if (productId) {
          const productRes = await axiosInstance.get(`/product/${productId}/`);
          const productData = productRes.data;
          console.log(productData);

          setFormData({
            name: productData.name,
            description: productData.description,
            cover_image: new File(
              [productData.product_video_type[0]?.cover_image],
              "cover_image.jpg",
              { type: "image/jpeg" }
            ),
            category: productData.category,
            phone_number: productData.phone_number,
            price: productData.price,
            original_video: new File(
              [productData.product_video_type[0].original_video],
              "original_video.mp4",
              { type: "video/mp4" }
            ),
          });
          b(productData);
          setVideoPreview(productData.product_video_type[0].original_video);
          const selectedCategory = categoryRes.data.results.find(
            (cat) => cat.id === productData.category[0]?.id
          );
          setSubcategory(selectedCategory?.children || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [productId]);

  return (
    <div className="upload_shorts">
      <div className="container-fluid upload_shorts_content mt-5">
        <div className="line"></div>
        <form onSubmit={handleSubmit} className="row pt-1">
          <div className="col-lg-6">
            <div
              className="pt-2 pb-3 d-flex gap-2 flex-column-reverse  align-items-center justify-content-center"
              style={{ width: "60%" }}
            >
              <h3>
                {productId ? `Edit ${type}` : `New ${type ? type : "Short"}`}
              </h3>
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
            <div
              className="select_shorts"
              style={{ height: type === "Video" ? "500px" : "688px" }}
            >
              {showProgressBar && (
                <div className="progress-container">
                  <Progress type="circle" percent={loadingProgress} />
                </div>
              )}
              {videoPreview && (
                <ReactPlayer
                  className="video_previev"
                  style={{ height: type === "Video" ? "200px" : "400px" }}
                  controls={true}
                  playing={false}
                  url={videoPreview}
                />
              )}
              <input
                type="file"
                name="original_video"
                id="original_video"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="d-flex justify-content-center flex-column w-100 align-items-center">
                <p>Drag and drop video files to upload</p>
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
          </div>
          <div className={`col-lg-6 select_form`}>
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

            <div className={`${!videoPreview && !productId ? "disabled" : ""}`}>
              <div className="input_data">
                <label htmlFor="">Title</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input_data">
                <label htmlFor="">Description</label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="input_data">
                <label htmlFor="">Phone number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
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
                    onChange={(value) =>
                      handleSelectChange("subcategory", value)
                    }
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
                <label htmlFor="">Price</label>
                <div className="file_price">
                  <img src={dollar} alt="Dollar" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="100"
                  />
                </div>
              </div>

              <button type="submit">{productId ? "Update" : "Publish"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadS;
