import React, { useContext } from "react";
import rightArrow from "../../../../assets/icons/right-arrow.svg";
import camera_img from "../../../../layout/Sidebar/icons/camera-outline.svg"
import "./style.scss";
import { ProductContext } from "../../../../context/ProductContext";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import LastVideoCard from "../../../../components/VideoCard";

const LatestVideos = () => {
  const { product, selectedCategory } = useContext(ProductContext);

  if (
    !product ||
    !Array.isArray(product.results) ||
    product.results.length === 0
  ) {
    return null;
  }

  const latestVideos = product.results
    .filter((item) => {
      if (selectedCategory) {
        return (
          item.product_video_type[0]?.product_type === "Video" &&
          item.category.includes(selectedCategory)
        );
      } else {
        return item.product_video_type[0]?.product_type === "Video";
      }
    })
    .sort((a, b) => new Date(b._added) - new Date(a.date_added))
    .slice(0, 4);

  return (
    <section className="latestVideos">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center pb-3">
            <div className="section__title">
              <img src={camera_img} alt="" width={27} />
              <h4>Latest videos</h4>
            </div>
            <Link to="/latest_videos">
              See all <img src={rightArrow} alt="" />
            </Link>
          </div>
          <Swiper
            grabCursor={true}
            slidesPerView={3}
            spaceBetween={10}
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
            {latestVideos.length === 0
              ? "No product found in this category"
              : latestVideos.map((item) => (
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

export default LatestVideos;
