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
              <h1>BiviClips</h1>
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
              <h1>Videos</h1>
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
