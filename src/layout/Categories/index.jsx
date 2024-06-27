import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../../context/ProductContext";
import { BASE_URL } from "../../api/baseUrl";

const Categories = () => {
  const location = useLocation();
  const { pathname } = location;
  const [category, setCategory] = useState([]);
  const { selectedCategory, setSelectedCategory } = useContext(ProductContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(`${BASE_URL}/categories/`);
        console.log(categoryRes.data)
        setCategory(categoryRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
  }, []);

  const isExcludedPath = () => {
    const excludedPaths = [
      "/login",
      "/register",
      "/reset_password",
      "/your_profile",
      "/your_profile/my_videos",
      "/your_profile/favorites",
      "/your_profile/liked_videos",
      "/your_profile/shorts",
      "/your_profile/about",
      "/404",
      "/chat",
      "/shorts",
      "/trending",
      "/top_videos",
      "/popular_channels",
      "/latest_videos",
      "/user/verify-otp",
      "/faq",
      "/user/reset-password",
      "/settings",
      "/basket",
      "/payment",
      "/call",
      "/your_profile/upload_video",
      "/your_profile/upload_shorts",
      "/your_profile/subscriptions",
      "/history",
      "/all_channels",
      "/channels_detail",
      "/channels_detail/channels_videos",
      "/channels_detail/channels_shorts",
      "/your_profile/edit_video/"
      ];

      let flag = excludedPaths.some(item => {
        if(pathname.includes(item)) return true
      })

    if (flag) {
      return true;
    }
    const dynamicPaths = [
      /^\/product_detail\/\d+$/
    ];

    return dynamicPaths.some((pattern) => pattern.test(pathname));
  };

  if (isExcludedPath()) {
    return null;
  }

  return (
    <section className="b_categories ">
      <div className="container-fluid d-flex align-items-center gap-3 b_cat">
        <button
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? "selected" : ""}
        >
          All
        </button>
        {category?.results?.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCategory(item.id)}
            className={selectedCategory === item.id ? "selected" : ""}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;

