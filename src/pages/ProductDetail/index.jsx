import React, { useContext, useEffect, useState, useRef } from "react";
import "./style.scss";
import eye from "../../assets/icons/eye.svg";
import like from "../../assets/icons/like.svg";
import download_img from "../../assets/icons/Download.svg";
import left from "../../assets/icons/direaction-left.svg";
import right from "../../assets/icons/direaction-right.svg";
import bag from "../../assets/icons/Bag-3.svg";
import wp from "../../assets/images/wp.svg";
import { Link, useParams } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import useAxios from "../../utils/useAxios";
import ReactPlayer from "react-player";
import { AuthContext } from "../../context/authContext";
import { handleAddToBasket } from "../../helpers";
import CommentsComponent from "./Comments";
import WishBtn from "../../components/WishlistBtn";
import RelatedVideos from "./RelatedVideos";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../api/baseUrl";
import logo from "../../assets/images/logoLight.svg";
import Plyr from "plyr-react";
import WhatsAppButton from "../../components/WhatsAppButton";
import ShareModal from "../../components/ShareModal";
import { useCart } from "react-use-cart";

const ProductDetail = () => {
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const { product, setProduct } = useContext(ProductContext);
  const { id } = useParams();
  const serviceId = Number(id);

  const [viewed, setViewed] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef(null);

  const { addItem } = useCart();

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
      await axiosInstance.post("/history/user_history_create/", data);
      setViewed(true);
    } catch (error) {
      console.error("Error adding product to history", error);
    }
  };

  const toggleLike = async (id) => {
    if (!user) {
      toast.warning("Please, sign in");
      return;
    }

    try {
      const res = await axiosInstance.post(`/toggle_product_like/${id}/`);

      if (res.status === 201) {
        toast.success("You Like Short!");
        setLiked(true);
        setProductDetail((prevDetail) => ({
          ...prevDetail,
          like_count: prevDetail.like_count + 1,
          is_liked: true,
        }));
      } else {
        toast.error("You Dislike Short!");
        setLiked(false);
        setProductDetail((prevDetail) => ({
          ...prevDetail,
          like_count: prevDetail.like_count - 1,
          is_liked: false,
        }));
      }

      setProduct((prevProduct) => ({
        ...prevProduct,
        results: prevProduct.results.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              like_count:
                res.status === 201 ? item.like_count + 1 : item.like_count - 1,
              is_liked: res.status === 201,
            };
          }
          return item;
        }),
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchProductDetail = async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/product/${productId}/`);
      const productData = response.data;

      let updatedViewCount = productData.view_count;
      console.log(productData);
      if (!viewed) {
        updatedViewCount += 1;
        await axios.patch(`${BASE_URL}/product/${productId}/`, {
          view_count: updatedViewCount,
        });
        setViewed(true);
      }

      setProductDetail({ ...productData, view_count: updatedViewCount });
      setLiked(productData.is_liked);
      handleAddToHistory(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (serviceId) {
      fetchProductDetail(serviceId);
    }
  }, [serviceId]);

  const handleDownload = () => {
    if (productDetail?.product_video_type[0]?.original_video) {
      try {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = productDetail?.product_video_type[0]?.original_video;
        a.download = "video.mp4";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error downloading video:", error);
        toast.error("Video yüklənmədi");
      }
    } else {
      toast.error("Video URL mövcud deyil");
    }
  };

  const shareUrl = `${window.location.origin}/${productDetail?.product_link}`;

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
    <div className="product_detail">
      <div className="container-fluid">
        {productDetail && !loading ? (
          <div className="row">
            <div className="col-xl-9 col-xxl-9 ">
              <div className="video_content">
                <div className="video_detail_content">
                  <img src={logo} className="video_logo" alt="" />
                  <div className="detail_video">
                    {/* <ReactPlayer
                      ref={playerRef}
                      className="video"
                      controls={true}
                      playing={isPlaying}
                      url={productDetail?.product_video_type[0]?.original_video}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    /> */}
                    <Plyr
                      // ref={playerRef}
                      // playsInline={false}
                      source={{
                        type: "video",
                        sources: [
                          {
                            src: productDetail?.product_video_type[0]
                              ?.original_video,
                            type: "video/mp4",
                          },
                        ],
                      }}
                    // onReady={onPlayerReady}
                    // onDuration={handleDuration}
                    />
                  </div>
                  <div className={`video_top ${isPlaying ? "" : "paused"}`}>
                    <span className="price">$ {productDetail.price}</span>
                    <WhatsAppButton
                      phoneNumber={productDetail?.phone_number}
                      productUrl={shareUrl}
                    />
                  </div>
                </div>
                <div className="video_content_name mt-3">
                  <div className="d-flex justify-content-center align-items-start flex-column h-100">
                    <h4>{productDetail.name}</h4>
                    <p>{productDetail.description}</p>
                  </div>
                  <div className="viev_part gap-1">
                    <div className="eye_btn">
                      <img src={eye} alt="eye.svg" />
                      <span>{formatViewCount(productDetail?.view_count)}</span>
                    </div>
                  </div>
                </div>




                <div className="video_content_bottom">
                  <div className="d-flex video_bottom_right">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="like-btn"
                        style={{
                          background: liked ? "#0385ca" : "none",
                        }}
                        onClick={() => toggleLike(productDetail.id)}
                      >
                        <img src={like} alt="like.svg" />
                      </button>
                      <span>{productDetail?.like_count}</span>
                    </div>
                  </div>
                  <div className="video_bottom_left d-flex">
                    <div className="heart">
                      <WishBtn ProductItemVideoCard={productDetail} />
                    </div>
                    <div
                      className="add_basket"
                      onClick={() => {
                        if (user.user_id === productDetail.user.id) {
                          toast.warning(
                            "You cannot add your own product to the basket"
                          );
                        } else {
                          handleAddToBasket(productDetail, user, axiosInstance);
                          addItem(productDetail);
                        }
                      }}
                    >
                      <img src={bag} alt="" />
                      <span></span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="download-btn" onClick={handleDownload}>
                        <img src={download_img} alt="Download" />
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="lr-btn">
                        <img src={left} alt="" />
                        <img src={right} alt="" />
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <ShareModal item={productDetail} />
                    </div>
                  </div>
                </div>



                <div className="video__properties">
                  <h4>Properties</h4>
                  <table style={{ borderCollapse: 'collapse', width: '100%' , background: '#252525', margin: ' 0 0 20px 0'}}>
                    <tbody>
                      {
                        productDetail.properties.map((item) => (
                          <tr key={item.id}>
                            <td style={{fontWeight: '600'}}>{item.product_property}</td>
                            <td >{item.property_value}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>

                <div className="video__address">
                  <h4>Address</h4>
                  <p><a href={productDetail.location_url}>
                    {productDetail.location}
                    </a></p>
                </div>



                <CommentsComponent productDetail={productDetail} />
              </div>
            </div>
          </div>
        ) : (
          <div className="loading_section">
            <h4>Loading...</h4>
          </div>
        )}
        <RelatedVideos />
      </div>
    </div>
  );
};

export default ProductDetail;
