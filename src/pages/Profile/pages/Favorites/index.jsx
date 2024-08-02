import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import filter from "../../../../assets/icons/filter.svg";
import useAxios from "../../../../utils/useAxios";
import { NavLink } from "react-router-dom";
import { handleAddToBasket, handleToggleWishlist } from "../../../../helpers";
import heartFull from "../../../../assets/icons/Subtract.svg";
import bag from "../../../../assets/icons/Bag-3.svg";
import blueHeart from "../../../../assets/icons/blueHeart.svg";
import eye from "../../../../assets/icons/eye.svg";
import { AuthContext } from "../../../../context/authContext";
import SortProduct from "../../../../components/SortProduct";
import Plyr from "plyr-react";
import { useCart } from "react-use-cart";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import getCurrencyByCountry from "../../../../utils/getCurrencyService";
const Favorites = () => {
  const {countryCurrencySymbol} = getCurrencyByCountry()
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext)
  const axiosInstance = useAxios();
  const [in_wishlist, set_in_wishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);
  const { addItem } = useCart();
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await axiosInstance.get("/order/favorites/");
        const filteredData = await response.data.results.filter(
          (item) => item.product_type === "Video"
        );
        setFavorites(filteredData);

      } catch (error) {
        console.log(error);
      }
    };

    const handleWishlistUpdate = (event) => {
      const { productId, status } = event.detail;
      if (!status) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.id !== productId)
        );
      }
    };
    window.addEventListener("wishlistUpdate", handleWishlistUpdate);
    fetchWishlistItems();

    return () => {
      window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
    };


  }, []);
  const handleWishlistToggle = async (product) => {
   
    if (!user) {
      toast.warning("Please sign in");
    } else if (user.user_id === product.product.user.id) {
      toast.warning("You cannot add your own product to the wishlist");
    }

    if (loading) return;
    setLoading(true);
    const newStatus = await handleToggleWishlist(product.id, axiosInstance);
    setLoading(false);
    if (newStatus !== null) {
      set_in_wishlist(newStatus);
      const wishlistState = JSON.parse(localStorage.getItem("wishlist")) || {};
      if (newStatus) {
        wishlistState[product.id] = newStatus;
      } else {
        delete wishlistState[product.id];
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlistState));
    } else {
      console.log("Failed to update wishlist status");
    }
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
  const onPlayerReady = () => {
    setIsLoading(false);
  };
  return (
    <>
      <Main />
      <Categories />
      <div className="favorites_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  flex-wrap favorites__categories">
              <h1>Favorites videos</h1>
              <div className="d-flex gap-3 flex-wrap">
                {/* <button className="favorites_videos_filter ">
                  <img src={filter} alt="upload" />
                  Filter
                </button> */}
                {/* <div className="favorites_videos-sort">
                  <img src={sort} alt="sort" />
                  Sort by
                </div> */}
                <div className="custom-select">
               <SortProduct sortedProducts={favorites} setSortedProducts={setFavorites}/>
                </div>
              </div>
            </div>
            {favorites?.map((item, index) => {
              return (
                <div className="col-lg-4 p-3" key={index}>
                  <div className="videoCard" >
                    <div className="main">
                      <span className="card_price">
                         {item?.product.price} {countryCurrencySymbol}
                      </span>
                      <img
                        className={`coverImage`}
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
                    <NavLink
                      className="heading w-100 flex-column justify-content-start align-items-start"
                      to={`/product_detail/${item.id}`}
                    >
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div className="user_name">{item.product?.user?.name}</div>
                        <h6>
                          <img src={blueHeart} alt="" />
                          {item.product?.like_count}
                        </h6>
                      </div>
                      <p>{item.product?.name}</p>
                    </NavLink>
                    <div className="cardBottom">
                      <div className="card_viev_count">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Eye/Solid">
<path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.6084 11.7892C18.5748 10.7724 18.5748 9.22772 17.6084 8.211C15.9786 6.49619 13.1794 4.16675 9.99984 4.16675C6.82024 4.16675 4.02108 6.49619 2.39126 8.211C1.42492 9.22772 1.42492 10.7724 2.39126 11.7892C4.02108 13.504 6.82024 15.8334 9.99984 15.8334C13.1794 15.8334 15.9786 13.504 17.6084 11.7892ZM9.99984 12.5001C11.3805 12.5001 12.4998 11.3808 12.4998 10.0001C12.4998 8.61937 11.3805 7.50008 9.99984 7.50008C8.61913 7.50008 7.49984 8.61937 7.49984 10.0001C7.49984 11.3808 8.61913 12.5001 9.99984 12.5001Z" fill="var(--textColor)"/>
</g>
</svg>

                        <span>
                          {formatViewCount(item?.product?.view_count)}
                        </span>
                      </div>
                      <div className="icons">
                        <button
                         onClick={() => handleWishlistToggle(item)}
                        >
<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.52422L10.765 1.70229C12.8777 -0.567429 16.3029 -0.567429 18.4155 1.70229C20.5282 3.972 20.5282 7.65194 18.4155 9.92165L11.5301 17.3191C10.685 18.227 9.31495 18.227 8.4699 17.3191L1.58447 9.92165C-0.528156 7.65194 -0.528155 3.972 1.58447 1.70229C3.69709 -0.56743 7.12233 -0.567428 9.23495 1.70229L10 2.52422ZM15 2.25C14.5858 2.25 14.25 2.58579 14.25 3C14.25 3.41421 14.5858 3.75 15 3.75C15.6904 3.75 16.25 4.30964 16.25 5C16.25 5.41421 16.5858 5.75 17 5.75C17.4142 5.75 17.75 5.41421 17.75 5C17.75 3.48122 16.5188 2.25 15 2.25Z" fill="var(--textColor)"/>
</svg>

                        </button>
                      

                        <button
                         onClick={() =>{
                          handleAddToBasket(
                            item?.product,
                            user,
                            axiosInstance
                          );
                          addItem(item?.product);
                        }
                      }
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorites;
