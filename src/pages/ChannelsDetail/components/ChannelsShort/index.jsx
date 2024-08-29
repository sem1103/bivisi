import React, { useContext, useRef, useState } from "react";
import "./style.scss";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import delete_img from "../../../../assets/icons/delete.svg";
import edit from "../../../../assets/icons/edit.svg";
import { ProductContext } from "../../../../context/ProductContext";
import { useNavigate } from "react-router-dom";

const ChannelsShort = ({ item, shortsCount }) => {
  const {countryCurrencySymbol} = useContext(ProductContext)
  const navigate = useNavigate()
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


  const handleCardClick = () => {
    handleAddToHistory(item);
    localStorage.setItem("activeShort", item.product.id);
    localStorage.setItem("channelShortsCount", shortsCount);
    setTimeout(() => {
      navigate(`/channel_shorts/${item.product.user.name}`);
    }, 1000);
  };


  const handleAddToHistory = async (productDetail) => {
    try {
      const watchDate = new Date().toISOString();
      const data = {
        history: [
          {
            product_video_type_id: productDetail.product.id,
            watch_date: watchDate,
          },
        ],
      };
      const res = await axiosInstance.post(
        "/history/user_history_create/",
        data
      );
      setViewed(true);
    } catch (error) {
      console.error("Error adding product to history", error);
    }
  };
  

  return (
    <div className="col-lg-3 col-md-4 col-sm-12 col-12 p-3" onClick={handleCardClick}>
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
              <span>{item?.product?.price}{countryCurrencySymbol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsShort;
