import React, { useContext, useRef, useState } from "react";
import bag from "../../assets/icons/Bag-3.svg";
import blueHeart from "../../assets/icons/blueHeart.svg";
import "./style.scss";
import { AuthContext } from "../../context/authContext";
import { NavLink, useNavigate } from "react-router-dom";
import { handleAddToBasket } from "../../helpers";
import WishBtn from "../WishlistBtn";
import { VideoContext } from "../../context/VideoContext";
import useAxios from "../../utils/useAxios";
import ReactPlayer from "react-player";
import { useCart } from "react-use-cart";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../assets/images/logoLight.svg";



const LastVideoCard = ({ ProductItemVideoCard, page }) => {
  const { user } = useContext(AuthContext);
  const { playingVideo, setPlaying } = useContext(VideoContext);
  const [isHovered, setIsHovered] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePlay = () => {
    if (playingVideo !== ProductItemVideoCard.id) {
      setPlaying(ProductItemVideoCard.id);
    }
  };

  const playerRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().pause();
    }
  };

  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    if (window.location.pathname.includes("/product_detail")) {
      e.preventDefault();
      setLoading(true); 

      
      setTimeout(() => {
        navigate(`/product_detail/${ProductItemVideoCard.id}`);
        setLoading(false);
      }, 2000);
    }
  };

  const handleDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    setVideoDuration(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
  };

  const colClass = ['latestvideo', 'topvideo', 'trendvideo'].includes(page) ? 'col-lg-3 col-md-4 col-sm-6 col-12' : '';

  return (
    <div className={`${colClass} p-2`}>
      <div
        className="videoCard"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="main">
          <img className="card_logo" src={logo} alt="" />
          <span className="video_count">{videoDuration}</span>
          <img
            className={`coverImage ${isHovered ? "hidden" : ""}`}
            src={ProductItemVideoCard?.product_video_type[0]?.cover_image}
            alt="cover"
          />
          <ReactPlayer
            ref={playerRef}
            url={ProductItemVideoCard?.product_video_type[0]?.original_video}
            playing={isHovered}
            muted
            autoPlay={false}
            className="video"
            width="100%"
            height="100%"
            onDuration={handleDuration}
          />
          {loading && (
            <div className="loading-overlay">
              <AiOutlineLoading3Quarters color="#fff" />
            </div>
          )}
        </div>
        <NavLink
          className="heading w-100 flex-column justify-content-start align-items-start"
          to={`/product_detail/${ProductItemVideoCard.id}`}
          onClick={handleNavigation}
        >
          <div className="d-flex w-100 justify-content-between align-items-center">
            <h1>{ProductItemVideoCard.user.name}</h1>
            <h6>
              <img src={blueHeart} alt="" />
              {ProductItemVideoCard.like_count}
            </h6>
          </div>
          <p>{ProductItemVideoCard.name}</p>
        </NavLink>
        <div className="cardBottom">
          <span>$ {ProductItemVideoCard.price}</span>
          <div className="icons">
            <WishBtn ProductItemVideoCard={ProductItemVideoCard} />
            <img
              src={bag}
              alt=""
              onClick={() => {
                if (user.user_id === ProductItemVideoCard.user.id) {
                  toast.warning(
                    "You cannot add your own product to the basket"
                  );
                } else {
                  handleAddToBasket(ProductItemVideoCard, user, axiosInstance);
                  addItem(ProductItemVideoCard);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastVideoCard;
