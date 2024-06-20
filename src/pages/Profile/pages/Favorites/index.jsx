import React, { useEffect, useState } from "react";
import "./style.scss";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import sort from "../../../../assets/icons/arrow-sort.svg";
import filter from "../../../../assets/icons/filter.svg";
import LastVideoCard from "../../../../components/VideoCard";
import useAxios from "../../../../utils/useAxios";
import ReactPlayer from "react-player";
import { Select } from "antd";
import ShortCard from "../../../../components/ShortCard";
import { NavLink } from "react-router-dom";
import { handleAddToBasket } from "../../../../helpers";
import WishBtn from "../../../../components/WishlistBtn";
import bag from "../../../../assets/icons/Bag-3.svg";
import blueHeart from "../../../../assets/icons/blueHeart.svg";

const Favorites = () => {
  const { Option } = Select;
  const [selectedOption, setSelectedOption] = useState("");
  const [favorites, setFavorites] = useState([]);
  const axiosInstance = useAxios();
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await axiosInstance.get("/order/favorites/");
        const filteredData = await response.data.results.filter(
          (item) => item.product_type === "Video"
        );
        setFavorites(filteredData);
        console.log(response);
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

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleAllClick = () => {
    setSelectedOption("");
  };

  const sortedProducts = [...favorites];
  if (selectedOption === "option1") {
    sortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
  } else if (selectedOption === "option2") {
    sortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
  } else if (selectedOption === "option3") {
    sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (selectedOption === "option4") {
    sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  return (
    <>
      <Main />
      <Categories />
      <div className="favorites_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  ">
              <h1>Favorites videos</h1>
              <div className="d-flex gap-3">
                <button className="favorites_videos_filter">
                  <img src={filter} alt="upload" />
                  Filter
                </button>
                {/* <div className="favorites_videos-sort">
                  <img src={sort} alt="sort" />
                  Sort by
                </div> */}
                <div className="custom-select">
                  <Select
                    defaultValue=""
                    value={selectedOption}
                    onChange={handleSelect}
                    suffixIcon={null}
                    className="select"
                    popupClassName="custom-dropdown"
                    prefixicon={<img src={sort} alt="plus.svg" width={20} />}
                  >
                    <Option value="" onClick={handleAllClick}>
                      All
                    </Option>
                    <Option value="option1">A to Z</Option>
                    <Option value="option2">Z to A</Option>
                    <Option value="option3">From cheap to expensive</Option>
                    <Option value="option4">From expensive to cheap</Option>
                  </Select>
                </div>
              </div>
            </div>
            {sortedProducts?.map((item, index) => {
              return (
                <>
                  <div className="col-lg-4 p-3">
                    <div className="videoCard">
                      <div className="main">
                        <img
                          className={`coverImage`}
                          src={item?.cover_image}
                          alt="cover"
                        />
                        <ReactPlayer
                          className={`video`}
                          controls={true}
                          url={item?.original_video}
                        />
                      </div>
                      <NavLink
                        className="heading w-100 flex-column justify-content-start align-items-start"
                        to={`/product_detail/${item.id}`}
                      >
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <h1>{item.product?.user?.name}</h1>
                          <h6>
                            <img src={blueHeart} alt="" />
                            {item.product?.like_count}
                          </h6>
                        </div>
                        <p>{item.product?.name}</p>
                      </NavLink>
                      <div className="cardBottom">
                        <span>$ {item.product.price}</span>
                        <div className="icons">
                          <WishBtn item={item} />
                          <img
                            src={bag}
                            alt=""
                            onClick={() =>
                              handleAddToBasket(
                                item?.product,
                                user,
                                axiosInstance
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favorites;
