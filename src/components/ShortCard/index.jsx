import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { VideoContext } from "../../context/VideoContext";
import useAxios from "../../utils/useAxios";
import getCurrencyByCountry from "../../utils/getCurrencyService";
import { ProductContext } from "../../context/ProductContext";

const ShortCard = ({ product }) => {
  const [localPlaying, setLocalPlaying] = useState(false);
  const { playingVideo, setPlaying: setGlobalPlaying } =
    useContext(VideoContext);
  const [isHovered, setIsHovered] = useState(false);
  const [viewed, setViewed] = useState(false);
  const navigate = useNavigate();
  const {countryCurrencySymbol} = useContext(ProductContext);
  const handlePlay = () => {
    if (playingVideo !== product.id) {
      setGlobalPlaying(product.id);
    }
    setLocalPlaying(!localPlaying);
  };
  console.log(countryCurrencySymbol);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    handlePlay();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setLocalPlaying(false);
  };

  const handleCardClick = () => {
    // handleAddToHistory(product);

    localStorage.setItem("activeShort", product.id);
    setTimeout(() => {
      navigate("/shorts");
    }, 1000);
  };

  const axiosInstance = useAxios();

  useEffect(() => {
    if (playingVideo !== product.id) {
      setLocalPlaying(false);
    }
  }, [playingVideo, product.id]);

  const handleAddToHistory = async (productDetail) => {
    try {
      const watchDate = new Date().toISOString();
      const data = {
        history: [
          {
            product_video_type_id: productDetail.product_video_type[0].id,
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
    <div className="p-1">
      <div
        className="shortCard"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <div className="wrapper">
          <div className="main">
            <img
              className={`coverImage ${isHovered ? "hidden" : ""}`}
              src={product.product_video_type[0]?.cover_image}
              alt="cover"
            />
          </div>
          <div className="shortCard-content">
              <p className="price">{product.price} {countryCurrencySymbol} </p>
            <div className="text">
              <p className="mb-0">{product.name.slice(0,10)}...</p>
              <span>{product.view_count} Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortCard;
