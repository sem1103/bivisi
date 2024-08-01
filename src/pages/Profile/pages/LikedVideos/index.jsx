import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import useAxios from "../../../../utils/useAxios";
import VideoIcon from "../../../../assets/icons/VideoIcon.svg";
import { useNavigate } from "react-router-dom";
import { handleAddToBasket } from "../../../../helpers";
import WishBtn from "../../../../components/WishlistBtn";
import bag from "../../../../assets/icons/Bag-3.svg";
import blueHeart from "../../../../assets/icons/blueHeart.svg";
import eye from "../../../../assets/icons/eye.svg";
import { useCart } from "react-use-cart";
import logo from "../../../../assets/images/logoLight.svg";
import Plyr from "plyr-react";
import { AuthContext } from "../../../../context/authContext";
import { toast } from "react-toastify";
import SortProduct from "../../../../components/SortProduct";
const LikedVideos = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const playerRef = useRef(null);
  const isPlayingRef = useRef(false);

  const { addItem } = useCart();
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/liked_products/`);
        setLikedProducts(res.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  const navigate = useNavigate();

  const handleNavigation = (e,id) => {
  
    if (window.location.pathname.includes("/product_detail")) {
      e.preventDefault();
      setLoading(true);

      setTimeout(() => {
        navigate(`/product_detail/${id}`);
        setLoading(false);
      }, 2000);
    } else {
      navigate(`/product_detail/${id}`);
    }
  };
  const handleDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    setVideoDuration(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
  };


  return (
    <>
      <Main />
      <Categories />
      <div className="liked_videos_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  liked__categories">
              <h1>Liked videos</h1>
              <div className="d-flex gap-3">
                {/* <button className="liked_videos_filter">
                  <img src={filter} alt="upload" />
                  Filter
                </button>
                <div className="liked_videos-sort">
                  <img src={sort} alt="sort" />
                  Sort by
                </div> */}
                <div className="custom-select">
              <SortProduct setSortedProducts={setLikedProducts} sortedProducts={likedProducts}/>
                </div>
              </div>
            </div>

            {likedProducts && likedProducts.length > 0 ? (
              likedProducts?.map((item) => {
                return (
                  <div className="col-lg-4 col-md-6 p-3" key={item?.id}>

                    <div
                      className="videoCard"
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
                        <span className="card_price">$ {item?.product.price}</span>
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
                        onClick={(e) => handleNavigation(e, item.id)}
                      >
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div className="user_namechannels video">{item.product.user.name}</div>
                          <h6>
                            <img src={blueHeart} alt="" />
                            {item.product?.like_count}
                          </h6>
                        </div>
                        <p>{item.product?.name}</p>
                      </div>
                      <div className="cardBottom">
                        <div className="card_viev_count">
                          <img src={eye} alt="eye.svg" />
                          <span>{formatViewCount(item?.product?.view_count)}</span>
                        </div>
                        <div className="icons">
                          <WishBtn item={item} />
                          <img
                            src={bag}
                            alt=""
                            onClick={() => {
                              if (user.user_id === item.product.user.id) {
                                toast.warning(
                                  "You cannot add your own product to the basket"
                                );
                              } else {
                                handleAddToBasket(item?.product, user, axiosInstance);
                                addItem(item?.product);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no_product">
                <img src={VideoIcon} alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LikedVideos;
