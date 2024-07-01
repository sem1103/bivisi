import React, { useRef, useState } from "react";
import "./style.scss";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import delete_img from "../../../../assets/icons/delete.svg";
import edit from "../../../../assets/icons/edit.svg";

const ChannelsShort = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };
  return (
    <div className="col-lg-3 col-md-4 col-sm-12 col-12 p-3">
      <div
        className="channels_shortcard"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="wrapper">
          <div className="main">
            <img
              className={`coverImage ${isHovered ? "hidden" : ""}`}
              src={item?.cover_image}
              alt="cover"
            />
          </div>
          <div className="shortCard-content">
            <div className="text">
              <p>{item?.product?.name}</p>
              <span>{item?.product?.price}$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsShort;
