import React, { useContext } from "react";
import "./style.scss";
import rightArrow from "../../../../assets/icons/right-arrow.svg";
import LastVideoCard from "../../../../components/VideoCard";
import { ProductContext } from "../../../../context/ProductContext";
import { Link } from "react-router-dom";
import video_img from "../../../../layout/Sidebar/icons/video-outline.svg"
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Pagination,
  A11y,
  Autoplay,
} from "swiper/modules";

import 'swiper/css';
const TopVideo = () => {
  const { product, setProduct, selectedCategory } = useContext(ProductContext);

  if (
    !product ||
    !Array.isArray(product.results) ||
    product.results.length === 0
  ) {
    return null;
  }

  let videoProducts;

  if (selectedCategory) {
    videoProducts = product.results.filter(
      (item) =>
        item.product_video_type[0]?.product_type === "Video" &&
        item.category.includes(selectedCategory)
    );
  } else {
    videoProducts = product.results.filter(
      (item) => item.product_video_type[0]?.product_type === "Video"
    );
  }


  return (
    <section className="topVideos">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center pb-3">
            <div className="section__title">
              <img src={video_img} alt="" width={27} />
              <h4>Top videos</h4>

            </div>
            <Link to="/top_videos">
              See all <img src={rightArrow} alt="" />
            </Link>
          </div>
          <Swiper
            grabCursor={true}
            slidesPerView={3}
            spaceBetween={10}
            modules={[Autoplay]}
            autoplay={{ delay: 1000 }}
            speed={2000}
            loop={true}

            breakpoints={{
              0: {
                spaceBetween: 5,
                slidesPerView: 1,

              },
              480: {
                spaceBetween: 1,
                slidesPerView: 2,
              },
              768: {
                spaceBetween: 15,
                slidesPerView: 3,
              },

              912: {
                spaceBetween: 15,
                slidesPerView: 3,
              },
              1280: {
                spaceBetween: 5,
                slidesPerView: 4,
              },
            }}
          >

            {videoProducts.length === 0
              ? "No product"
              : videoProducts
                ?.slice(0, 4)
                .map((item) => (
                  <SwiperSlide key={item.id}>
                    <LastVideoCard ProductItemVideoCard={item} page="home" />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TopVideo;
