import React, { useContext, useEffect, useState } from "react";
import PopularChannelCard from "../../../../components/PChannel";
import rightArrow from "../../../../assets/icons/right-arrow.svg";
import "./style.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";
import { AuthContext } from "../../../../context/authContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import star_img from "../../../../layout/Sidebar/icons/star-outline.svg"

import 'swiper/css';
const PopularChannels = () => {
  const [popularC, setPopularC] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPChannels = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/popular-channels/`);
            const filteredChannels = response.data.results.filter(channel => channel.username !== user?.username);
                setPopularC(filteredChannels);
        } catch (error) {
            console.error('Failed to fetch popular channels:', error);
        }
    };
    fetchPChannels();
}, []);
  return (
    <section className="channels">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center">
            <div className="section__title">
            <img src={star_img} alt="" width={27}/>
            <h4>Popular channels</h4>
            </div>
            <Link to='/popular_channels'>
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
              slidesPerView: 1,
            },
            768: {
              spaceBetween: 15,
              slidesPerView: 2,
            },

            912: {
              spaceBetween: 15,
              slidesPerView: 2,
            },
            1280: {
              spaceBetween: 5,
              slidesPerView: 2,
            },
          }}
          >

          {
            popularC.slice(0,2).map((item)=>(

              <SwiperSlide key={item.id}><PopularChannelCard popularChannels={item} /></SwiperSlide>
            ))
          }
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularChannels;
