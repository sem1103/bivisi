import React, { useEffect, useState } from "react";
import "./style.scss";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-fade";
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";
const FeaturedVideo = () => {
  const [slider, setSlider] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sliderRes = await axios.get(`${BASE_URL}/core/slider/`);
        setSlider(sliderRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  return (
    <section className="fVideo ">
      <div className="container-fluid">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          modules={[Pagination, Autoplay, Navigation]}
          autoplay={{delay:100}}
          speed={1400}
          loop={true}
          navigation
          pagination={{ clickable: true }}
        >
          {slider?.map((item) => (
            <SwiperSlide key={item.id}>
              <img src={item.image} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedVideo;
