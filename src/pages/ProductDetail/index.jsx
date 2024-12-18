import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import "./style.scss";

import eye from "../../assets/icons/eye.svg";
import empryAvatar from './../../assets/images/user-empty-avatar.png'
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
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
import getCurrencyByCountry from "../../utils/getCurrencyService";
import { NotificationContext } from "../../context/NotificationContext";
import { GoogleMap, Marker } from '@react-google-maps/api';
import Cookies from 'js-cookie';
import useSubscription from "../../hooks/useSubscription";


const ProductDetail = () => {
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const { product, setProduct, isLoaded, countryCurrencySymbol } = useContext(ProductContext);
  const USER_TOKKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;
  const [videoAuthor, setVideoAuthor] = useState(false)
  const [subscribeCount, setSubscribeCount] = useState(0);

  const { id } = useParams();
  const location = useLocation();
  const serviceId = Number(id);
  const [category, setCategory] = useState([])
  const [subcategory, setSubcategory] = useState([]);

  const { notificationSocket } = useContext(NotificationContext);

  const [viewed, setViewed] = useState(false);
  const [productDetail, setProductDetail] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef(null);
  const [isShowMap, setIsShowMap] = useState(false)
  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 })

  const {
    isSubscribed,
    followersCount,
    handleSubscribe,
    handleUnsubscribe,
    searchUser,
    checkSubscribed
  } = useSubscription(location.state.username)




  const { addItem } = useCart();

  const fetchCoordinates = async (ADDRESS) => {
    setIsShowMap(false);

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: ADDRESS,
          key: 'AIzaSyDSalM865lZHc8e3B7a0KWSCJKzGm7m37Q',
        },
      });

      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;

        setCenter({
          lat,
          lng,
        });
        setIsShowMap(true);
      }
    } catch (error) {
      console.error('Ошибка при геокодировании:', error);
    }
  };
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

        notificationSocket.send(
          JSON.stringify(
            {
              notification_type: res.data.notification_type,
              message: res.data.message,
              sender: {
                ...res.data.sender,
                avatar: res.data.sender.avatar ? '' : res.data.sender
              },
              notification_id: res.data.notification_id,
              product_cover_image: res.data.product_cover_image

            })
        )
      } else {
        toast.error("You Dislike Short!");
        setLiked(false);
        setProductDetail((prevDetail) => ({
          ...prevDetail,
          like_count: prevDetail.like_count && prevDetail.like_count - 1,
          is_liked: false,
        }));
      }

      setProduct((prevProduct) => ([
        ...prevProduct.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              like_count:
                res.status === 201 ? item.like_count + 1 : item.like_count - 1,
              is_liked: res.status === 201,
            };
          }
          return item;
        })
      ]));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchProductDetail = async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/product/${productId}/`);
      const productData = response.data;
      let updatedViewCount = productData.view_count;
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
      fetchCoordinates(productData.location);


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

  const handleDownload = async () => {
    const videoUrl = productDetail?.product_video_type[0]?.original_video;

    if (videoUrl) {
      try {
        const response = await fetch(videoUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'video/mp4',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'video.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Освободить память
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading video:', error);
      }
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


  const fetchData = async () => {
    try {
      const categoryRes = await axios.get(
        `${BASE_URL}/categories/`
      );
      setCategory(categoryRes.data.results);


    } catch (err) {
      console.log(err);
    }
  };






  useEffect(() => {

    fetchData();

    return () => {
      setIsShowMap(false)

    };
  }, []);

  useEffect(() => {
    if(productDetail){
      searchUser(productDetail.user.name)
      checkSubscribed()
    }

  }, [productDetail, id]);




  const EmbedCodeGenerator = (videoUrl) => {
    return (
      <div>
        <h3>Embed Code:</h3>
        <textarea
          readOnly
          value={`<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`}
          rows="4"
          cols="50"
        />
      </div>
    );
  };









  return (
    <div className="product_detail">
      <div className="container-fluid">
        {productDetail && !loading ? (
          <div className="video__detail">
            <div className="video">
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
                    <span className="price">{countryCurrencySymbol} {productDetail.price}</span>
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Icon/Eye/Solid"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.6084 11.7892C18.5748 10.7724 18.5748 9.22772 17.6084 8.211C15.9786 6.49619 13.1794 4.16675 9.99984 4.16675C6.82024 4.16675 4.02108 6.49619 2.39126 8.211C1.42492 9.22772 1.42492 10.7724 2.39126 11.7892C4.02108 13.504 6.82024 15.8334 9.99984 15.8334C13.1794 15.8334 15.9786 13.504 17.6084 11.7892ZM9.99984 12.5001C11.3805 12.5001 12.4998 11.3808 12.4998 10.0001C12.4998 8.61937 11.3805 7.50008 9.99984 7.50008C8.61913 7.50008 7.49984 8.61937 7.49984 10.0001C7.49984 11.3808 8.61913 12.5001 9.99984 12.5001Z" fill="var(--textColor)"></path></g></svg>
                      <span>{formatViewCount(productDetail?.view_count)}</span>
                    </div>
                  </div>
                </div>

                <div className="user__block">
                  <div className="left__block">
                    <div className="user__avatar">
                      <img src={productDetail.user.avatar ? productDetail.user.avatar : empryAvatar} alt="" />
                    </div>
                    <div className="user__desc">
                      <NavLink to={`/channels_detail/channels_videos/${productDetail.user.name}`} />
                      <h2 className="user__name">
                        {productDetail.user.name}
                      </h2>
                      {
                        user &&
                        <p>
                          {followersCount} subscribers
                        </p>
                      }

                    </div>
                  </div>

                  <div className="right__block">
                    {
                      productDetail.user.name != user?.username && user &&
                      <div className="subs_btn">
                        <button
                          onClick={() => {
                            isSubscribed ? handleUnsubscribe() : handleSubscribe()
                          }}
                          className={`subs-button ${isSubscribed ? 'unsubs-button' : ''}`}>{!isSubscribed ? <span>Subscribe</span> : <span>Unsubscribe</span>}</button>
                      </div>
                    }

                  </div>
                </div>

                <div className="video_content_bottom">
                  <div className="d-flex video_bottom_right">
                    <div className={`d-flex align-items-center gap-2 fill__change ${liked ? 'liked' : ''}`}>
                      <button
                        className="like-btn "
                        style={{
                          background: liked ? "#0385ca" : "none",
                        }}
                        onClick={() => toggleLike(productDetail.id)}
                      >
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="like">
                            <path id="combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M7.62205 15.5H5.28959C3.45412 15.5 1.85419 14.2508 1.40902 12.4701L0.287751 7.98507C-0.0278224 6.72278 0.926894 5.5 2.22804 5.5H6.33315L5.59098 4.38675C4.48339 2.72536 5.67437 0.5 7.67111 0.5H7.99982L11.2014 6.10276C11.2877 6.25386 11.3331 6.42487 11.3331 6.5989V13.2981C11.3331 13.6325 11.166 13.9447 10.8879 14.1302L9.84085 14.8282C9.18378 15.2662 8.41175 15.5 7.62205 15.5ZM12.5832 6.54167V13.625C12.5832 14.6605 13.4226 15.5 14.4582 15.5C15.4937 15.5 16.3332 14.6605 16.3332 13.625V6.54166C16.3332 5.50613 15.4937 4.66667 14.4582 4.66667C13.4226 4.66667 12.5832 5.50613 12.5832 6.54167Z" fill="white" />
                          </g>
                        </svg>

                      </button>
                      <span>{productDetail?.like_count}</span>
                    </div>
                  </div>
                  <div className="video_bottom_left d-flex">
                    <div className="heart">
                      <WishBtn ProductItemVideoCard={productDetail} />
                    </div>
                    <div
                      className="add_basket stroke__change"
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
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Icon/Bag 3">
                          <path id="Rectangle 794" d="M13.3332 5.00008C13.3332 3.15913 11.8408 1.66675 9.99984 1.66675C8.15889 1.66675 6.6665 3.15913 6.6665 5.00008" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path id="Rectangle 788" d="M3.80146 7.91988C4.00997 6.25179 5.42797 5 7.10905 5H12.8905C14.5716 5 15.9896 6.25179 16.1981 7.91988L17.0314 14.5866C17.2801 16.5761 15.7288 18.3333 13.7238 18.3333H6.27572C4.27073 18.3333 2.71944 16.5761 2.96813 14.5866L3.80146 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                          <path id="Vector 1788" d="M7.5 13.3333C9.46345 14.4502 10.5396 14.4385 12.5 13.3333" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                      </svg>
                      <span></span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="download-btn stroke__change" onClick={handleDownload}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="Icon/Download">
                            <path id="Vector 347" d="M7.5 10L10 12.5M10 12.5L12.5 10M10 12.5L10 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path id="Vector 354" d="M6.25 7.5V7.5C4.17893 7.5 2.5 9.17893 2.5 11.25L2.5 13.5C2.5 15.7091 4.29086 17.5 6.5 17.5H13.5C15.7091 17.5 17.5 15.7091 17.5 13.5V11.25C17.5 9.17893 15.8211 7.5 13.75 7.5V7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </g>
                        </svg>
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button className="lr-btn fill__change"
                        onClick={() => {
                          EmbedCodeGenerator()
                        }}
                      >
                        <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="direaction left">
                            <path id="Vector 175 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M5.21849 0.164376C5.54194 0.423133 5.59438 0.895102 5.33562 1.21855L1.71044 5.75003L5.33562 10.2815C5.59438 10.605 5.54194 11.0769 5.21849 11.3357C4.89505 11.5944 4.42308 11.542 4.16432 11.2185L0.164321 6.21855C-0.0548108 5.94464 -0.0548108 5.55542 0.164321 5.28151L4.16432 0.281506C4.42308 -0.0419402 4.89505 -0.0943812 5.21849 0.164376Z" fill="white" />
                          </g>
                        </svg>

                        <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="direaction right">
                            <path id="Vector 175 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M0.781506 0.164376C0.45806 0.423133 0.405619 0.895102 0.664376 1.21855L4.28956 5.75003L0.664376 10.2815C0.405618 10.605 0.458059 11.0769 0.781506 11.3357C1.10495 11.5944 1.57692 11.542 1.83568 11.2185L5.83568 6.21855C6.05481 5.94464 6.05481 5.55542 5.83568 5.28151L1.83568 0.281506C1.57692 -0.0419401 1.10495 -0.0943811 0.781506 0.164376Z" fill="white" />
                          </g>
                        </svg>
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <ShareModal item={productDetail} />
                    </div>
                  </div>
                </div>









                <div className="video__properties">
                  <h4>Categories</h4>
                  <table style={{ borderCollapse: 'collapse', width: '100%', background: 'var(--backgroundColor)', margin: ' 0 0 20px 0' }}>
                    <tbody>
                      {

                        category.map(item => {
                          if (item.id == productDetail.category[0]) {
                            return <tr >
                              <td style={{ fontWeight: '600' }}>{item.name}</td>
                              <td >{item.children.map(sub => sub.id == productDetail.category[1] && sub.name)}</td>
                            </tr>
                          }
                        })



                      }
                    </tbody>
                  </table>
                </div>
                {
                  productDetail.properties.length > 0 &&
                  <div className="video__properties">
                    <h4>Properties</h4>
                    <table style={{ borderCollapse: 'collapse', width: '100%', background: 'var(--backgroundColor)', margin: ' 0 0 20px 0' }}>
                      <tbody>
                        {

                          productDetail.properties.map((item) => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: '600' }}>{item.product_property}</td>
                              <td >{item.property_value}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                }


                <div className="video__address">
                  <h4>Address</h4>
                  <p><a href={productDetail.location_url} target="_blank">
                    {productDetail.location}
                  </a></p>


                  <div className="address__map">
                    {isLoaded && isShowMap && (
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}

                        center={center}
                        zoom={15}

                        options={{
                          disableDefaultUI: true, // Отключить стандартный интерфейс
                          gestureHandling: 'greedy', // Управление жестами
                          zoomControl: true, // Включить управление зумом
                        }}
                      >
                        <Marker position={center} />
                      </GoogleMap>
                    )}

                  </div>


                </div>



                <CommentsComponent productDetail={productDetail} />
              </div>
            </div>

            <RelatedVideos category={productDetail.category[0]} />

          </div>
        ) : (
          <div className="loading_section">
            <h4>Loading...</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
