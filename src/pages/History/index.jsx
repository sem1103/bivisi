import React, { useContext, useEffect, useRef, useState } from "react";
import bag from "../../assets/icons/Bag-3.svg";
import "./style.scss";
import { ProductContext } from "../../context/ProductContext";
import useAxios from "../../utils/useAxios";
import historyOutline from "../../layout/Sidebar/icons/history-outline.svg";
import { NavLink, useNavigate } from "react-router-dom";
import WishBtn from "../../components/WishlistBtn";
import { handleAddToBasket } from "../../helpers";
import { AuthContext } from "../../context/authContext";
import trash from "../../assets/icons/trash.svg";
import { toast } from "react-toastify";
import { VideoContext } from "../../context/VideoContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Pagination, A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import cameraOutline from "../../layout/Sidebar/icons/camera-outline.svg"
import Plyr from "plyr-react";
import { useCart } from "react-use-cart";
import getCurrencyByCountry from "../../utils/getCurrencyService";
const History = () => {
  const { addItem } = useCart();
  const { product } = useContext(ProductContext);
  if (
    !product ||
    !Array.isArray(product) ||
    product.length === 0
  ) {
    return null;
  }

  const filterProductsByType = (productType) => {
    return history.filter(
      (item) => item.product_video_type?.product_type === productType
    );
  };

  const axiosInstance = useAxios();
  const [history, setHistory] = useState([]);
  const [localPlaying, setLocalPlaying] = useState(false);
  const { playingVideo, setPlaying: setGlobalPlaying } =
    useContext(VideoContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const onPlayerReady = () => {
    setIsLoading(false);
  };
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/history/user_history_list/");
        setHistory(response.data.results);
      } catch (error) {
        console.error("Error fetching viewing history", error);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteFromHistory = async (historyId) => {

    try {
      await axiosInstance.delete("/history/user_history_delete/", {
        data: {
          history: [{ id: historyId }],
        },
      });

      setHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== historyId)
      );
      toast.success("Product deleted from history");
    } catch (error) {
      console.error("Error deleting product from history", error);
    }
  };

  const videoProducts = filterProductsByType("Video");
  const shortsProducts = filterProductsByType("Shorts");

  const navigate = useNavigate();

  const handleCardClick = (id) => {
    console.log(id);
    localStorage.setItem("highlightedShort", id);
    setTimeout(() => {
      navigate("/shorts");
    }, 1000);
  };
  const {countryCurrencySymbol} = getCurrencyByCountry();

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
      <section className="history_cards">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 pb-3">
              <div className="page__title">
                <img src={historyOutline} alt="history-icon" />
                <h4>History</h4>
              </div>

            </div>

            <Swiper
              spaceBetween={20}
              slidesPerView={5}
              modules={[Pagination, A11y, Navigation]}
              loop={true}
              pagination={{ clickable: true }}
              breakpoints={{
                0: {
                  spaceBetween: 5,
                  slidesPerView: 2,
                },
                480: {
                  spaceBetween: 5,
                  slidesPerView: 3,
                },
                768: {
                  spaceBetween: 15,
                  slidesPerView: 3,
                },

                912: {
                  spaceBetween: 15,
                  slidesPerView: 3,
                },
                1280: {
                  spaceBetween: 15,
                  slidesPerView: 6,
                },
              }}
            >
              {shortsProducts.map((item) => {
                return (
                  <SwiperSlide
                    key={item.id}
                    onClick={() =>
                      handleCardClick(item.product_video_type?.product?.id)
                    }
                  >
                    <div
                      className="shortCard"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="wrapper">
                        <div className="main">
                          <img
                            className="coverImage"
                            src={item.product_video_type?.cover_image}
                            alt="cover"
                          />
                        </div>
                        <div className="shortCard-content">
                          <div className="text">
                            <p>{item.product_video_type?.product.name}</p>
                            <span>
                              {item.product_video_type?.product.price + countryCurrencySymbol}
                            </span>
                          </div>{" "}
                          <button
                            className="delete_icon_history"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFromHistory(item.id)
                            }}
                          >
                           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Trash/Outline">
<path id="Vector" d="M15.8333 7.50008L15.2367 15.2557C15.1032 16.9924 13.655 18.3334 11.9132 18.3334H8.08677C6.34498 18.3334 4.89684 16.9924 4.76326 15.2557L4.16667 7.50008M17.5 5.83341C15.3351 4.7784 12.7614 4.16675 10 4.16675C7.23862 4.16675 4.66493 4.7784 2.5 5.83341M8.33333 4.16675V3.33341C8.33333 2.41294 9.07953 1.66675 10 1.66675C10.9205 1.66675 11.6667 2.41294 11.6667 3.33341V4.16675M8.33333 9.16675V14.1667M11.6667 9.16675V14.1667" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>

                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="col-lg-12 pt-5 pb-2 d-flex gap-2">
              <img width={27} src={cameraOutline} alt="" />
              <h4>Videos</h4>
            </div>

            {videoProducts?.map((item) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-12 p-2" key={item.id}>
                <div
                  className="videoCard"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="main">
                    <span className="card_price">
                      {item.product_video_type?.product?.price + countryCurrencySymbol}
                    </span>
                    <img
                      className={`coverImage ${isHovered ? "hidden" : ""}`}
                      src={item?.product_video_type?.cover_image}
                      alt="cover"
                    />
                    <Plyr
                      ref={playerRef}
                      source={{
                        type: "video",
                        sources: [
                          {
                            src: item?.product_video_type
                              ?.original_video,
                            type: "video/mp4",
                          },
                        ],
                      }}
                      options={{ muted: true, controls: ["play", "pause", "progress"] }}
                      onReady={onPlayerReady}
                    // onDuration={handleDuration}

                    />
                    {/* <span className="video_count">{videoDuration}</span> */}
                    {loading && (
                      <div className="loading-overlay">
                        <AiOutlineLoading3Quarters color="#fff" />
                      </div>
                    )}
                  </div>
                  <NavLink
                    className="heading w-100 flex-column justify-content-start align-items-start"
                    to={`/product_detail/${item?.product_video_type?.product?.id}`}
                  >
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <p>{item.product_video_type?.product.name}</p>
                      <h6>{item.product_video_type?.product.like_count}</h6>
                    </div>
                    <p>{item.product_video_type?.product.description}</p>
                  </NavLink>
                  <div className="cardBottom">
                    {/* <div className="card_viev_count"> */}
                    {/* <img src={eye} alt="eye.svg" /> */}
                    {/* <span>
                        {formatViewCount(item.product_video_type?.product?.view_count)}
                      </span> */}
                    {/* </div> */}
                    <div className="icons ">
                      {/* <WishBtn ProductItemVideoCard={item} /> */}

                      <button className="history-btn" onClick={() => {
                        handleAddToBasket(item?.product_video_type?.product, user, axiosInstance);
                        addItem(item?.product_video_type?.product);
                      }} >
                       <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Bag 3">
<path id="Rectangle 794" d="M13.3332 5.00008C13.3332 3.15913 11.8408 1.66675 9.99984 1.66675C8.15889 1.66675 6.6665 3.15913 6.6665 5.00008" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path id="Rectangle 788" d="M3.80146 7.91988C4.00997 6.25179 5.42797 5 7.10905 5H12.8905C14.5716 5 15.9896 6.25179 16.1981 7.91988L17.0314 14.5866C17.2801 16.5761 15.7288 18.3333 13.7238 18.3333H6.27572C4.27073 18.3333 2.71944 16.5761 2.96813 14.5866L3.80146 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<path id="Vector 1788" d="M7.5 13.3333C9.46345 14.4502 10.5396 14.4385 12.5 13.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>

                      </button>
                      <button className="history-btn delete__history" onClick={() => handleDeleteFromHistory(item?.id)}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Icon/Trash/Outline"><path id="Vector" d="M15.8333 7.50008L15.2367 15.2557C15.1032 16.9924 13.655 18.3334 11.9132 18.3334H8.08677C6.34498 18.3334 4.89684 16.9924 4.76326 15.2557L4.16667 7.50008M17.5 5.83341C15.3351 4.7784 12.7614 4.16675 10 4.16675C7.23862 4.16675 4.66493 4.7784 2.5 5.83341M8.33333 4.16675V3.33341C8.33333 2.41294 9.07953 1.66675 10 1.66675C10.9205 1.66675 11.6667 2.41294 11.6667 3.33341V4.16675M8.33333 9.16675V14.1667M11.6667 9.16675V14.1667" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round"></path></g></svg>

                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default History;
