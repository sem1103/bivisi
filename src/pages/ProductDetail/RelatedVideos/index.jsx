import React, { useContext } from "react";
import { ProductContext } from "../../../context/ProductContext";
import LastVideoCard from "../../../components/VideoCard";
import "./style.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const Related_Videos = ({ onProductClick }) => {
  const { product } = useContext(ProductContext);

  return (
    <>
      <section className="related_videos">
          <div className="row">
            <div className="col-lg-12">
              <div className="title">Related videos</div>
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
            {product?.results?.slice(0, 4)?.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <LastVideoCard
                  ProductItemVideoCard={item}
                />
                </SwiperSlide>
              );
            })}

            </Swiper>
          </div>
      </section>
    </>
  );
};

export default Related_Videos;
