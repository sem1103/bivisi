import React, { useContext, useEffect } from "react";
import "./style.scss";
import LastVideoCard from "../../../../components/VideoCard";
import { ProductContext } from "../../../../context/ProductContext";
import { Link } from "react-router-dom";
import video_img from "../../../../layout/Sidebar/icons/video-outline.svg"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const TopVideo = () => {
  const { filteredProducts, selectedCategory, minPrice, maxPrice, setSelectedCategory } = useContext(ProductContext);

  useEffect(() => {
    if (selectedCategory === null) {
      setSelectedCategory("All");
    }
  }, [selectedCategory, setSelectedCategory]);


  if (
    !filteredProducts ||
    !Array.isArray(filteredProducts) ||
    filteredProducts.length === 0
  ) {
    return null;
  }

  const videoProducts = filteredProducts
    .filter((item) => {
      const isCategoryMatch = selectedCategory === "All" || item.category.includes(Number(selectedCategory));
      const isPriceMatch = (minPrice === 0 || Number(item.price) >= minPrice) && (maxPrice === 0 || Number(item.price) <= maxPrice);

      return item.product_video_type[0]?.product_type === "Video" && isCategoryMatch && isPriceMatch;
    })
   

  return (
    <section className="topVideos">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center">
            <div className="section__title">
              <img src={video_img} alt="" width={27} />
              <h4>Top videos</h4>
            </div>
            <Link to="/top_videos" className="see__all">
              See all
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon/Right arrow">
                  <path id="Vector 190" d="M11.6667 6.66687L15 10.0002M15 10.0002L11.6667 13.3335M15 10.0002L5 10.0002" stroke="var(--textColor)" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                </g>
              </svg>
            </Link>
          </div>
          <Swiper
            grabCursor={true}
            slidesPerView={3.1}
            spaceBetween={10}
            loop={true}
            breakpoints={{
              0: {
                spaceBetween: 5,
                slidesPerView: 1.1,
                centeredSlides: true

              },
              480: {
                spaceBetween: 1,
                slidesPerView: 2.1,
                centeredSlides: true
              },
              768: {
                spaceBetween: 15,
                slidesPerView: 3.1,
                centeredSlides: true
              },

              912: {
                spaceBetween: 15,
                slidesPerView: 3.1,
                centeredSlides: true
              },
              1280: {
                spaceBetween: 5,
                slidesPerView: 4.1,
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
