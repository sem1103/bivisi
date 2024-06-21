import React, { useContext } from "react";
import ShortCard from "../../../../components/ShortCard";
import rightArrow from "../../../../assets/icons/right-arrow.svg";
import "./style.scss";
import { ProductContext } from "../../../../context/ProductContext";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Pagination,
  A11y,
  Autoplay,
} from "swiper/modules";

import 'swiper/css';
const ShortCards = () => {
  const { product, selectedCategory } = useContext(ProductContext);
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
        item.product_video_type[0]?.product_type === "Shorts" &&
        item.category.includes(selectedCategory)
    );
  } else {
    videoProducts = product.results.filter(
      (item) => item.product_video_type[0]?.product_type === "Shorts"
    );
  }

  console.log(videoProducts)
  return (
    <>
      <section className="shortCards">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center">
              <h4>BiviClips</h4>
              <Link to="/shorts">
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
                slidesPerView: 2,

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
                slidesPerView: 4,
              },
              1280: {
                spaceBetween: 5,
                slidesPerView: 6,
              },
            }}
            >
            {videoProducts.length === 0 ? (
              <p style={{ color: "white", textAlign: "center" }}>
                No product found in this category
              </p>
            ) : (
              videoProducts
                .slice(0, 6)
                .map((item) => 
                <SwiperSlide key={item.id}><ShortCard product={item}  /></SwiperSlide>)
            )}

            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShortCards;
