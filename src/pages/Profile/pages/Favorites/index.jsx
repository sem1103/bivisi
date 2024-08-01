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
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
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
        setFilteredFavorites(filteredData)

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
              <div className="d-flex gap-3 flex-wrap">

                <FilterModal applyFilter={applyFilter} />
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
                        $ {item?.product.price}
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
                        <img src={eye} alt="eye.svg" />
                        <span>
                          {formatViewCount(item?.product?.view_count)}
                        </span>
                      </div>
                      <div className="icons">
                        <img
                          src={heartFull}
                          alt="wishlist"
                          onClick={() => handleWishlistToggle(item)}
                          style={{ cursor: loading ? "not-allowed" : "pointer" }}
                        />
                        <img
                          src={bag}
                          alt="basket"
                          onClick={() => {
                            handleAddToBasket(
                              item?.product,
                              user,
                              axiosInstance
                            );
                            addItem(item?.product);
                          }
                          }
                        />
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
