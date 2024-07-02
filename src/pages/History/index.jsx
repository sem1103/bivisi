import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import { ProductContext } from "../../context/ProductContext";
import useAxios from "../../utils/useAxios";
import ReactPlayer from "react-player";
import { NavLink, useNavigate } from "react-router-dom";
import WishBtn from "../../components/WishlistBtn";
import { handleAddToBasket } from "../../helpers";
import { AuthContext } from "../../context/authContext";
import trash from "../../assets/icons/trash.svg";
import { toast } from "react-toastify";
import { VideoContext } from "../../context/VideoContext";
import { AiOutlineDelete } from "react-icons/ai";
import { Pagination, A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import eye from "../../assets/icons/eye.svg";


const History = () => {
  const { product } = useContext(ProductContext);
  if (
    !product ||
    !Array.isArray(product.results) ||
    product.results.length === 0
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
              <div className="shorts_logo">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 168.071 168.071"
                  xml:space="preserve">
                  <g>
                    <g>
                      <path opacity="0.5" style={{ fill: "currentColor" }} d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z">
                      </path>
                      <g id="XMLID_15_">
                        <g>
                          <path
                            style={{ fill: "currentColor" }} d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z">
                          </path>
                          <path style={{ fill: "currentColor" }} d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z">
                          </path>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h4>BiviClips</h4>
            </div>
            </div>
            <Swiper
              spaceBetween={20}
              slidesPerView={5}
              modules={[Pagination, A11y, Autoplay, Navigation]}
              autoplay={{ delay: 300 }}
              speed={2000}
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
                              {item.product_video_type?.product.price}$
                            </span>
                          </div>{" "}
                          <button
                            className="delete_icon_history"
                            onClick={() => handleDeleteFromHistory(item.id)}
                          >
                            <img src={trash} alt="" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="col-lg-12 pt-5 pb-2">
              <h4>Videos</h4>
            </div>

            {videoProducts?.map((item) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
                <div
                  className="videoCard"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="main">
                    <span className="card_price">
                      $ {item.product_video_type?.product?.price}
                    </span>
                    <img
                      className={`coverImage ${isHovered ? "hidden" : ""}`}
                      src={item?.product_video_type?.cover_image}
                      alt="cover"
                    />
                    <ReactPlayer
                      url={item?.product_video_type?.original_video}
                      playing={isHovered}
                      muted
                      autoPlay={false}
                      className="video"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <NavLink
                    className="heading w-100 flex-column justify-content-start align-items-start"
                    to={`/product_detail/${item?.product_video_type?.product?.id}`}
                  >
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <h1>{item.product_video_type?.product.name}</h1>
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
                    <div className="icons">
                      <WishBtn item={item} />
                      <button onClick={() => handleDeleteFromHistory(item.id)}>
                        <img src={trash} alt="" />
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
