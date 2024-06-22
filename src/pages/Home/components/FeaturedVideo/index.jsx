import React, { useEffect, useState } from "react";
import "./style.scss";
import { Pagination, Autoplay, Navigation, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";
import SwiperCore from "swiper/core";

SwiperCore.use([Pagination, Autoplay, Navigation, A11y]);

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
        {slider?.length > 0 && (
          <Swiper
            spaceBetween={7}
            slidesPerView={1}
            modules={[Pagination, Autoplay, Navigation]}
            autoplay={{ delay: 400, disableOnInteraction: false }}
            speed={6000}
            loop={true}
            navigation={false}
            pagination={{ clickable: true }}
          >
            {slider?.map((item) => (
              <SwiperSlide key={item.id}>
                <img src={item.image} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default FeaturedVideo;
