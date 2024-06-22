import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import sort from "../../../../assets/icons/arrow-sort.svg";
import filter from "../../../../assets/icons/filter.svg";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import useAxios from "../../../../utils/useAxios";
import VideoIcon from "../../../../assets/icons/VideoIcon.svg";
import ReactPlayer from "react-player";
import { NavLink } from "react-router-dom";
import { handleAddToBasket } from "../../../../helpers";
import { ProductContext } from "../../../../context/ProductContext";
import WishBtn from "../../../../components/WishlistBtn";
import bag from "../../../../assets/icons/Bag-3.svg";
import blueHeart from "../../../../assets/icons/blueHeart.svg";

const LikedVideos = () => {
  const axiosInstance = useAxios();
  const [likedProducts, setLikedProducts] = useState([]);
  const { user } = useContext(ProductContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/liked_products/`);
        setLikedProducts(res.data.results);
        console.log("liked products", res.data.results);
        console.log(likedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Main />
      <Categories />
      <div className="liked_videos_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  flex-wrap liked__categories">
              <h1>Liked videos</h1>
              <div className="d-flex gap-3">
                <button className="liked_videos_filter">
                  <img src={filter} alt="upload" />
                  Filter
                </button>
                <div className="liked_videos-sort">
                  <img src={sort} alt="sort" />
                  Sort by
                </div>
              </div>
            </div>

            {likedProducts && likedProducts.length > 0 ? (
              likedProducts?.map((item) => {
                return (
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
                        to={`/product_detail/${item.product?.id}`}
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
                );
              })
            ) : (
              <div className="no_product">
                <img src={VideoIcon} alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LikedVideos;
