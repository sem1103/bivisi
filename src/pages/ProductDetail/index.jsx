import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import "./style.scss";
import "./map.scss";

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
import Map, { Marker } from 'react-map-gl';
import getCurrencyByCountry from "../../utils/getCurrencyService";


const ProductDetail = () => {
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const { product, setProduct } = useContext(ProductContext);
  const { id } = useParams();
  const serviceId = Number(id);
  const [category, setCategory] = useState([])
  const [subcategory, setSubcategory] = useState([]);


  const [viewed, setViewed] = useState(false);
  const [productDetail, setProductDetail] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef(null);
  const [isShowMap, setIsShowMap] = useState(false)
  const TOKEN = 'pk.eyJ1Ijoic2VtMTEwMyIsImEiOiJjbHhyemNmYTIxY2l2MmlzaGpjMjlyM3BsIn0.CziZDkWQkfqlxfqiKWW3IA';
  const {countryCurrencySymbol} = getCurrencyByCountry();
  const [initialViewState, setInitialViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 13,
  });



  const [markerPosition, setMarkerPosition] = useState({
    longitude: 0,
    latitude: 0,
  });

  const { addItem } = useCart();

  const fetchCoordinates = async (ADDRESS) => {
    setIsShowMap(false)

    try {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(ADDRESS)}.json`, {
        params: {
          access_token: TOKEN
        }
      });

      const { features } = response.data;
      if (features && features.length > 0) {
        const [longitude, latitude] = features[0].center;
       
      
        setInitialViewState({
          longitude,
          latitude,
          zoom: 13,
        });

        setMarkerPosition({
          longitude,
          latitude,
          zoom: 13,
        });

        setIsShowMap(true)
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






useEffect(() => {

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

  fetchData();
  
  return () => {
    setIsShowMap(false)

  };
}, []);
 



 

 
    

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

                {
                  console.log(productDetail)
                }
                <div className="video__properties">
                  <h4>Categories</h4>
                  <table style={{ borderCollapse: 'collapse', width: '100%', background: '#252525', margin: ' 0 0 20px 0' }}>
                    <tbody>
                      {

                        category.map(item => {
                          if(item.id == productDetail.category[0]){
                            return  <tr >
                              <td style={{ fontWeight: '600' }}>{item.name}</td>
                              <td >{item.children.map(sub => sub.id == productDetail.category[1] && sub.name)}</td>
                            </tr>
                          }
                        })
                        
                         
                       
                      }
                    </tbody>
                  </table>
                </div>

                <div className="video__properties">
                  <h4>Properties</h4>
                  <table style={{ borderCollapse: 'collapse', width: '100%', background: '#252525', margin: ' 0 0 20px 0' }}>
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

                <div className="video__address">
                  <h4>Address</h4>
                  <p><a href={productDetail.location_url} target="_blank">
                    {productDetail.location}
                  </a></p>


                <div className="address__map">
                  {isShowMap &&
                   <Map
                   initialViewState={initialViewState}
                   mapStyle="mapbox://styles/mapbox/streets-v9"
                   mapboxAccessToken={TOKEN}
                   width="100%"
                   height="250px"

                 >
                 <Marker longitude={markerPosition.longitude} latitude={markerPosition.latitude} >
                 <svg width={30} viewBox="0 0 24 24" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(0 -1028.4)"> <path d="m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z" transform="translate(0 1028.4)" fill="#e74c3c"></path> <path d="m12 3c-2.7614 0-5 2.2386-5 5 0 2.761 2.2386 5 5 5 2.761 0 5-2.239 5-5 0-2.7614-2.239-5-5-5zm0 2c1.657 0 3 1.3431 3 3s-1.343 3-3 3-3-1.3431-3-3 1.343-3 3-3z" transform="translate(0 1028.4)" fill="#c0392b"></path> </g> </g></svg>
                 </Marker>
                 </Map>
                  
                  }
               
                </div>

                  
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
