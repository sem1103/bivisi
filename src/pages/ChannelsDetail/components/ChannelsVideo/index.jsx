import React from "react";
import "./style.scss";
import blueHeartd from "../../../../assets/icons/blue-heart.svg";
import edit from "../../../../assets/icons/edit.svg";
import trash from "../../../../assets/icons/trash.svg";
import { NavLink } from "react-router-dom";

const ChannelsVideo = ({ item }) => {
  return (
    <>
      <div className="col-lg-4 pb-3">
        <div className="channels_videocard">
          <img src={item?.cover_image} alt="" className="main" />

          <div className="heading">
            <h1>{item?.product?.name}</h1>
            <h6>
              <img src={blueHeartd} alt="" />
              {item?.product?.like_count}
            </h6>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur</p>
          <div className="cardBottom">
            <span>{item.product.price}$</span>
            <div className="icons"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelsVideo;
