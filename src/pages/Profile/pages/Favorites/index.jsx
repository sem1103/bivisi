import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
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
import FilterModal from "../../../../components/FilterModal";
import { ProductContext } from "../../../../context/ProductContext";
import filter from "../../../../assets/icons/filter.svg";
import getCurrencyByCountry from "../../../../utils/getCurrencyService";
const Favorites = () => {
  const {countryCurrencySymbol} = useContext(ProductContext)
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const { user } = useContext(AuthContext)
  const axiosInstance = useAxios();
  const [in_wishlist, set_in_wishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const { addItem } = useCart();
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await axiosInstance.get("/order/favorites/");
        const filteredData = await response.data.results.filter(
          (item) => item.product_type === "Video"
        );
        setFavorites(filteredData);
        setFilteredFavorites(filteredData)

      } catch (error) {
        console.log(error);
      }
    };


    const handleWishlistUpdate = (event) => {
      const { productId, status } = event.detail;
      if (!status) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.product.id !== productId)
        );
      }
    };
    window.addEventListener("wishlistUpdate", handleWishlistUpdate);
    fetchWishlistItems();

    return () => {
      window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
    };


  }, []);
  useEffect(() => {
    setFilteredFavorites(favorites);
  }, [favorites]);
  
  const handleWishlistToggle = async (product) => {
    
    if (!user) {
      toast.warning("Please sign in");
    } else if (user.user_id === product.product.user.id) {
      toast.warning("You cannot add your own product to the wishlist");
    }

    if (loading) return;
    setLoading(true);
    const newStatus = await handleToggleWishlist(product.product.id, axiosInstance);
    setLoading(false);
    if (newStatus !== null) {
      set_in_wishlist(newStatus);
      const wishlistState = JSON.parse(localStorage.getItem("wishlist")) || {};
      if (newStatus) {
        wishlistState[product.product.id] = newStatus;
      } else {

        delete wishlistState[product.product.id];
        
        
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
  const applyFilter = (selectedCategory, minPrice, maxPrice) => {
    let filtered = favorites;

    if (selectedCategory !== "All") {
        filtered = filtered.filter(item => item.product.category.includes(Number(selectedCategory)));
    }

    if (minPrice !== 0 || maxPrice !== 0) {
        filtered = filtered.filter(item => Number(item.product.price) >= minPrice && Number(item.product.price) <= maxPrice);
    }

    setFilteredFavorites(filtered);
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
              <div className="d-flex gap-3 flex-wrap align-items-center">

              {/* <button className="favorites_videos_filter stroke__change" onClick={() => setShowModal(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Filter">
<path id="Vector" d="M2.5 4.16667H8.33333M8.33333 4.16667C8.33333 5.08714 9.07953 5.83333 10 5.83333C10.9205 5.83333 11.6667 5.08714 11.6667 4.16667M8.33333 4.16667C8.33333 3.24619 9.07953 2.5 10 2.5C10.9205 2.5 11.6667 3.24619 11.6667 4.16667M2.5 10H10M15.8333 10H17.5M15.8333 10C15.8333 10.9205 15.0871 11.6667 14.1667 11.6667C13.2462 11.6667 12.5 10.9205 12.5 10C12.5 9.07953 13.2462 8.33333 14.1667 8.33333C15.0871 8.33333 15.8333 9.07953 15.8333 10ZM11.6667 4.16667H17.5M10 15.8333H17.5M2.5 15.8333H4.16667M4.16667 15.8333C4.16667 16.7538 4.91286 17.5 5.83333 17.5C6.75381 17.5 7.5 16.7538 7.5 15.8333C7.5 14.9129 6.75381 14.1667 5.83333 14.1667C4.91286 14.1667 4.16667 14.9129 4.16667 15.8333Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>
                Filter
            </button> */}
     {showModal&&<FilterModal setShowModal={setShowModal} applyFilter={applyFilter} />}
                <div className="custom-select">
                  <SortProduct sortedProducts={favorites} setSortedProducts={setFavorites} />
                </div>
              </div>
            </div>
            {filteredFavorites?.map((item, index) => {
              return (
                <div className="col-lg-4 col-sm-6 p-3" key={index}>
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
                      state={{channellName: user.username}}
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
                         className="fill__change"
                          onClick={() => handleWishlistToggle(item)}
                         >
 <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.52422L10.765 1.70229C12.8777 -0.567429 16.3029 -0.567429 18.4155 1.70229C20.5282 3.972 20.5282 7.65194 18.4155 9.92165L11.5301 17.3191C10.685 18.227 9.31495 18.227 8.4699 17.3191L1.58447 9.92165C-0.528156 7.65194 -0.528155 3.972 1.58447 1.70229C3.69709 -0.56743 7.12233 -0.567428 9.23495 1.70229L10 2.52422ZM15 2.25C14.5858 2.25 14.25 2.58579 14.25 3C14.25 3.41421 14.5858 3.75 15 3.75C15.6904 3.75 16.25 4.30964 16.25 5C16.25 5.41421 16.5858 5.75 17 5.75C17.4142 5.75 17.75 5.41421 17.75 5C17.75 3.48122 16.5188 2.25 15 2.25Z" fill="var(--textColor)"/>
 </svg>

                         </button>
                      

                         <button
                         className="stroke__change"
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
