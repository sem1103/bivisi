import React, { useContext, useRef, useState } from "react";
import "./style.scss";
import {useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";
import { VideoContext } from "../../../../context/VideoContext";
import useAxios from "../../../../utils/useAxios";
import { useCart } from "react-use-cart";
import logo from "../../../../assets/images/logoLight.svg";
import Plyr from "plyr-react";
import eye from "../../../../assets/icons/eye.svg";
import WishBtn from "../../../../components/WishlistBtn";
import bag from "../../../../assets/icons/Bag-3.svg";
import blueHeart from "../../../../assets/icons/blueHeart.svg";
import { handleAddToBasket } from "../../../../helpers";
import getCurrencyByCountry from "../../../../utils/getCurrencyService";
const ChannelsVideo = ({ item }) => {
  const { user } = useContext(AuthContext);
  const { playingVideo, setPlaying } = useContext(VideoContext);
  const [isHovered, setIsHovered] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);
  const {countryCurrencySymbol} = getCurrencyByCountry()

  const playerRef = useRef(null);

  const [playerState, setPlayerState] = useState({
    playing: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const isPlayingRef = useRef(false);

  const playVideo = async () => {
    const player = playerRef.current?.plyr;
    if (player) {
      try {
        await player.play();
        isPlayingRef.current = true;
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  };

  const pauseVideo = async () => {
    const player = playerRef.current?.plyr;
    if (player && isPlayingRef.current) {
      try {
        await player.pause();
        isPlayingRef.current = false;
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playVideo();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    pauseVideo();
  };
  const onPlayerReady = () => {
    setIsLoading(false);
  };

  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    if (window.location.pathname.includes("/product_detail")) {
      e.preventDefault();
      setLoading(true);

      setTimeout(() => {
        navigate(`/product_detail/${item.id}`);
        setLoading(false);
      }, 2000);
    } else {
      navigate(`/product_detail/${item.id}`);
    }
  };

  const handleDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    setVideoDuration(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
  };

  // const colClass = ["latestvideo", "topvideo", "trendvideo"].includes(page)
  //   ? "col-xl-3 col-xxl-3 col-lg-4 col-md-4 col-sm-6 col-12"
  //   : "";

  function formatViewCount(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  }
  return (
    <>
      <div className="col-lg-4 col-sm-6 pb-3">
        {/* <div className="channels_videocard">
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
        </div> */}

        <div
          className="channels_videocard"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {
            item.is_premium &&
            <div className="premiup__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.91634 2.16669V2.45377C7.06917 1.92837 6.06985 1.62502 4.99967 1.62502C3.9295 1.62502 2.93018 1.92837 2.08301 2.45377V2.16669C2.08301 1.06212 2.97844 0.166687 4.08301 0.166687H5.91634C7.02091 0.166687 7.91634 1.06212 7.91634 2.16669ZM9.66634 7.16669C9.66634 9.74402 7.577 11.8334 4.99967 11.8334C2.42235 11.8334 0.333008 9.74402 0.333008 7.16669C0.333008 4.58936 2.42235 2.50002 4.99967 2.50002C7.577 2.50002 9.66634 4.58936 9.66634 7.16669ZM5.45868 5.13002L5.78318 5.81363C5.85774 5.9707 6.00187 6.07957 6.16859 6.10476L6.89419 6.21438C7.31403 6.27781 7.48167 6.81425 7.17787 7.12214L6.65282 7.65426C6.53218 7.77652 6.47713 7.95268 6.50561 8.12532L6.62956 8.87668C6.70128 9.31143 6.26238 9.64297 5.88686 9.43771L5.23787 9.08296C5.08875 9.00145 4.9106 9.00145 4.76148 9.08296L4.11249 9.43771C3.73697 9.64297 3.29807 9.31143 3.36979 8.87668L3.49374 8.12532C3.52222 7.95268 3.46717 7.77652 3.34653 7.65426L2.82148 7.12214C2.51768 6.81425 2.68532 6.27781 3.10516 6.21438L3.83076 6.10476C3.99748 6.07957 4.14161 5.9707 4.21617 5.81363L4.54066 5.13002C4.72842 4.73447 5.27092 4.73447 5.45868 5.13002Z" fill="white" />
              </svg>
              <p>Premium</p>
            </div>
          }
          <div className="main">

            <img className="card_logo" src={logo} alt="" />
            <span className="card_price"> {  item?.product?.price  + countryCurrencySymbol}</span>
            {/* <span className="video_count">{videoDuration}</span> */}
            <img
              className={`coverImage `}
              src={item?.cover_image}
              alt="cover"
            />
            <Plyr
              ref={playerRef}
              source={{
                type: "video",
                sources: [
                  {
                    src: item?.original_video,
                    type: "video/mp4",
                  },
                ],
              }}
              options={{ muted: true, controls: ["play", "pause", "progress"] }}
              onReady={onPlayerReady}
            // onDuration={handleDuration}
            />
            {loading && (
              <div className="loading-overlay">
                <AiOutlineLoading3Quarters color="#fff" />
              </div>
            )}
          </div>
          <div
            className="heading w-100 flex-column justify-content-start align-items-start"
            onClick={handleNavigation}
          >
            <div className="d-flex w-100 justify-content-between align-items-center">
              <h4>{item.product.user.name}</h4>
              <h6>
                <img src={blueHeart} alt="" />
                {item.product?.like_count}
              </h6>
            </div>
            <p>{item?.product?.name}</p>
          </div>
          <div className="cardBottom">
            <div className="card_viev_count">
            <svg style={{margin: "0 5px 0 0"}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Eye/Solid">
<path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.6084 11.7892C18.5748 10.7724 18.5748 9.22772 17.6084 8.211C15.9786 6.49619 13.1794 4.16675 9.99984 4.16675C6.82024 4.16675 4.02108 6.49619 2.39126 8.211C1.42492 9.22772 1.42492 10.7724 2.39126 11.7892C4.02108 13.504 6.82024 15.8334 9.99984 15.8334C13.1794 15.8334 15.9786 13.504 17.6084 11.7892ZM9.99984 12.5001C11.3805 12.5001 12.4998 11.3808 12.4998 10.0001C12.4998 8.61937 11.3805 7.50008 9.99984 7.50008C8.61913 7.50008 7.49984 8.61937 7.49984 10.0001C7.49984 11.3808 8.61913 12.5001 9.99984 12.5001Z" fill="white"/>
</g>
</svg>
              <span>{formatViewCount(item?.product?.view_count)}</span>
            </div>
            <div className="icons stroke__change">
              <WishBtn item={item} />
              <button
              onClick={() => {
                if (user.id === item.id) {
                  toast.warning(
                    "You cannot add your own product to the basket"
                  );
                } else {
                  handleAddToBasket(item, user, axiosInstance);
                  addItem(item);
                }
              }}
              >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Bag 3">
<path id="Rectangle 794" d="M13.3332 5.00008C13.3332 3.15913 11.8408 1.66675 9.99984 1.66675C8.15889 1.66675 6.6665 3.15913 6.6665 5.00008" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Rectangle 788" d="M3.80146 7.91988C4.00997 6.25179 5.42797 5 7.10905 5H12.8905C14.5716 5 15.9896 6.25179 16.1981 7.91988L17.0314 14.5866C17.2801 16.5761 15.7288 18.3333 13.7238 18.3333H6.27572C4.27073 18.3333 2.71944 16.5761 2.96813 14.5866L3.80146 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<path id="Vector 1788" d="M7.5 13.3333C9.46345 14.4502 10.5396 14.4385 12.5 13.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>

              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelsVideo;
