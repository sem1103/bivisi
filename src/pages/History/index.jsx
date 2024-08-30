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
import { useInView } from 'react-intersection-observer';



const History = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { countryCurrencySymbol } = useContext(ProductContext);


  const axiosInstance = useAxios();
  const { addItem } = useCart();
  const [history, setHistory] = useState([]);

  const [isHovered, setIsHovered] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);


  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const { ref: ref2, inView: inView2 } = useInView({
    threshold: 0.5,
  });
  const [productsPaginCount, setProductsPaginCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [videoProducts, setVideoProducts] = useState([]);
  const [shortsProducts, setShortsProducts] = useState([]);

  const filterProductsByType = (productType) => {
    console.log(history.filter(
      (item) => item.product_video_type?.product_type === productType
    ).sort((a,b) => new Date(b.watch_date) - new Date(a.watch_date)));
    
    return history.filter(
      (item) => item.product_video_type?.product_type === productType
    ).sort((a,b) => new Date(b.watch_date) - new Date(a.watch_date));
    
  };



  const handleMouseEnter = () => {
    setIsHovered(true);
   
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  
    
  };
  const onPlayerReady = () => {
    setIsLoading(false);
  };
  const fetchHistory = async (offset) => {
    try {
      const response = await axiosInstance.get(`/history/user_history_list/?offset=${offset}&ordering=-watch_date`);
      setHistory(prev => prev.length ? [...prev, ...response.data.results] : response.data.results);
      setProductsCount(response.data.count)
      console.log(response.data);


    } catch (error) {
      console.error("Error fetching viewing history", error);
    }
  };


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

 


  const handleCardClick = (id) => {
    console.log(id);
    localStorage.setItem("highlightedShort", id);
    localStorage.setItem("activeShort", id);
    setTimeout(() => {
      navigate("/shorts");
    }, 1000);
  };

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


  const onScrollEnd = () => {
    setProductsPaginCount(prevCount => {
      if (history.length != productsCount) {
        const newCount = prevCount + 1;
        fetchHistory(newCount * 12);
        return newCount;
      }

    });

  }


  useEffect(() => {
    fetchHistory(0);
  }, []);
  useEffect(() => {
    if (inView || inView2) {
      onScrollEnd();
    }
  }, [inView, inView2]);

  useEffect(() => {
    if(history){
      setVideoProducts(filterProductsByType("Video"));
    setShortsProducts(filterProductsByType("Shorts"));
    }
  }, [history]);

  return (
    <>
      <section className="history_cards">
        <div className="container-fluid">
          <div className="row ">
            <div className="col-lg-12 pb-3">
              <div className="page__title">
                <img src={historyOutline} alt="history-icon" />
                <h4>History</h4>
              </div>

            </div>

            <div className="col-lg-12 pt-5 pb-2 d-flex gap-2">
            <svg
    width="28px"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 168.071 168.071"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path
          d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z"
          style={{ fill: 'currentcolor', color: 'rgb(4, 171, 242)' }}
        />
        <g id="XMLID_15_">
          <g>
            <path
              d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z"
              style={{ fill: 'currentcolor' }}
            />
            <path
              d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z"
              style={{ fill: 'var(--textColor)' }}
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
              <h4>BiviClips</h4>
            </div>

            <Swiper
              spaceBetween={20}
              slidesPerView={'5.3'}
              breakpoints={{
                0: {
                  spaceBetween: 5,
                  slidesPerView: 2.3,
                },
                480: {
                  spaceBetween: 5,
                  slidesPerView: 3.3,
                },
                768: {
                  spaceBetween: 15,
                  slidesPerView: 3.3,
                },

                912: {
                  spaceBetween: 15,
                  slidesPerView: 3.3,
                },
                1280: {
                  spaceBetween: 15,
                  slidesPerView: 5.3,
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
                                <path id="Vector" d="M15.8333 7.50008L15.2367 15.2557C15.1032 16.9924 13.655 18.3334 11.9132 18.3334H8.08677C6.34498 18.3334 4.89684 16.9924 4.76326 15.2557L4.16667 7.50008M17.5 5.83341C15.3351 4.7784 12.7614 4.16675 10 4.16675C7.23862 4.16675 4.66493 4.7784 2.5 5.83341M8.33333 4.16675V3.33341C8.33333 2.41294 9.07953 1.66675 10 1.66675C10.9205 1.66675 11.6667 2.41294 11.6667 3.33341V4.16675M8.33333 9.16675V14.1667M11.6667 9.16675V14.1667" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" />
                              </g>
                            </svg>

                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
              }
              {
                !(history.length >= productsCount) &&
                <SwiperSlide>

                  <div ref={ref} className="loading">
                    <div class="loader">
                      <span class="bar"></span>
                      <span class="bar"></span>
                      <span class="bar"></span>
                    </div>
                  </div>


                </SwiperSlide>
              }
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
                   {
                    
                    
            // item.product_video_type.is_premium &&
            // <div className="premiup__icon">
            //   <svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" viewBox="0 0 10 12" fill="none">
            //     <path fillRule="evenodd" clipRule="evenodd" d="M7.91634 2.16669V2.45377C7.06917 1.92837 6.06985 1.62502 4.99967 1.62502C3.9295 1.62502 2.93018 1.92837 2.08301 2.45377V2.16669C2.08301 1.06212 2.97844 0.166687 4.08301 0.166687H5.91634C7.02091 0.166687 7.91634 1.06212 7.91634 2.16669ZM9.66634 7.16669C9.66634 9.74402 7.577 11.8334 4.99967 11.8334C2.42235 11.8334 0.333008 9.74402 0.333008 7.16669C0.333008 4.58936 2.42235 2.50002 4.99967 2.50002C7.577 2.50002 9.66634 4.58936 9.66634 7.16669ZM5.45868 5.13002L5.78318 5.81363C5.85774 5.9707 6.00187 6.07957 6.16859 6.10476L6.89419 6.21438C7.31403 6.27781 7.48167 6.81425 7.17787 7.12214L6.65282 7.65426C6.53218 7.77652 6.47713 7.95268 6.50561 8.12532L6.62956 8.87668C6.70128 9.31143 6.26238 9.64297 5.88686 9.43771L5.23787 9.08296C5.08875 9.00145 4.9106 9.00145 4.76148 9.08296L4.11249 9.43771C3.73697 9.64297 3.29807 9.31143 3.36979 8.87668L3.49374 8.12532C3.52222 7.95268 3.46717 7.77652 3.34653 7.65426L2.82148 7.12214C2.51768 6.81425 2.68532 6.27781 3.10516 6.21438L3.83076 6.10476C3.99748 6.07957 4.14161 5.9707 4.21617 5.81363L4.54066 5.13002C4.72842 4.73447 5.27092 4.73447 5.45868 5.13002Z" fill="white" />
            //   </svg>
            //   <p>Premium</p>
            // </div>
          }
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
                    state={{chanellName: item.user}}
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
                            <path id="Rectangle 794" d="M13.3332 5.00008C13.3332 3.15913 11.8408 1.66675 9.99984 1.66675C8.15889 1.66675 6.6665 3.15913 6.6665 5.00008" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path id="Rectangle 788" d="M3.80146 7.91988C4.00997 6.25179 5.42797 5 7.10905 5H12.8905C14.5716 5 15.9896 6.25179 16.1981 7.91988L17.0314 14.5866C17.2801 16.5761 15.7288 18.3333 13.7238 18.3333H6.27572C4.27073 18.3333 2.71944 16.5761 2.96813 14.5866L3.80146 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                            <path id="Vector 1788" d="M7.5 13.3333C9.46345 14.4502 10.5396 14.4385 12.5 13.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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

            

{
                
               
                history.length > 0 && !(history.length >= productsCount) &&
                <div className="loading" ref={ref2}>
                <div className="wrapper" >
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="circle"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                  <div className="shadow"></div>
                </div>
              </div>


                
              }
          </div>
        </div>
      </section>
    </>
  );
};

export default History;
