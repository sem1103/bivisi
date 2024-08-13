import React, { useContext } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import { Swiper, SwiperSlide } from 'swiper/react';

const Categories = () => {
  const location = useLocation();
  const { pathname } = location;
  const { selectedCategory, setSelectedCategory, category } = useContext(ProductContext);
  const isExcludedPath = () => {

    const excludedPaths = [
      "/login",
      "/register",
      "/reset_password",
      "/re-register",
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
      "/your_profile/edit_video/",
      "/live-streams",
      "/new-stream"
      ];

    let flag = excludedPaths.some(item => pathname.includes(item));

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
      <div className="container-fluid d-flex align-items-center b_cat">
      <Swiper
      spaceBetween={15}
      slidesPerView={3}
      >
      <SwiperSlide>
      <button
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === "All" ? "selected" : ""}
        >
          All
        </button>
      </SwiperSlide>
         
        {category?.map((item) => (
           <SwiperSlide>
            <button
            key={item.id}
            onClick={() => setSelectedCategory(item.id)}
            className={selectedCategory === item.id ? "selected" : ""}
          >
            {item.name}
          </button>
           </SwiperSlide>
          
        ))}
        
        </Swiper>

      </div>

    </section>
  );
};
export default Categories;
