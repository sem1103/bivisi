// MyVideo.js
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxios from "../../../../utils/useAxios";
import { ProductContext } from "../../../../context/ProductContext";
import blueHeartd from "../../../../assets/icons/blue-heart.svg";
import edit from "../../../../assets/icons/edit.svg";
import trash from "../../../../assets/icons/trash.svg";
import "./style.scss";
import getCurrencyByCountry from "../../../../utils/getCurrencyService";




const MyVideo = ({ productItem }) => {
  const navigate = useNavigate()
  const {  setProduct } = useContext(ProductContext);
  const axiosInstance = useAxios();
  const { countryCurrencySymbol } = getCurrencyByCountry();
  const deletePost = async (id) => {
    try {
      await axiosInstance.delete(`/product_delete/${id}/`);
      setProduct((prevProduct) => ({
        ...prevProduct,
        results: prevProduct.filter((item) => item.id !== id),
      }));
      toast.success("Product successfully deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleNavigation = (e) => {
    console.log(productItem);
    
    navigate(`/product_detail/${productItem.product.id}`, { state: { channellId: productItem.product.user } });
  };


  return (
    <div className="col-lg-4 pb-3">
      <div className="myVideoCard">
        {/* <span className="card_price">$ {productItem?.price}</span> */}
        <img
          src={productItem.cover_image}
          alt=""
          className="main"
        />
          <div className="heading" onClick={handleNavigation} style={{cursor: 'pointer'}}>
          <h1>{productItem.product.description}</h1>
          <h6>
            <img src={blueHeartd} alt="" />
            {productItem.product.like_count}
          </h6>
          </div>
        <p>{productItem.product.name}</p>
        <div className="cardBottom">
          <span>{productItem.product.price} {countryCurrencySymbol}</span>
          <div className="icons">
            <NavLink to={`/your_profile/edit_video/${productItem.id}`} onClick={() => {
              localStorage.setItem('myEditVideo', JSON.stringify(productItem))
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon/Edit/Outline">
                  <path id="Vector" d="M2.5 17.5H17.5M11.487 4.42643C11.487 4.42643 11.487 5.78861 12.8492 7.1508C14.2114 8.51299 15.5736 8.51299 15.5736 8.51299M6.09969 14.9901L8.96028 14.5814C9.37291 14.5225 9.7553 14.3313 10.05 14.0365L16.9358 7.1508C17.6881 6.39848 17.6881 5.17874 16.9358 4.42642L15.5736 3.06424C14.8213 2.31192 13.6015 2.31192 12.8492 3.06424L5.96347 9.94997C5.66873 10.2447 5.47754 10.6271 5.41859 11.0397L5.00994 13.9003C4.91913 14.536 5.464 15.0809 6.09969 14.9901Z" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" />
                </g>
              </svg>

            </NavLink>
            <button
              onClick={() => deletePost(productItem.id)}
             
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon/Trash/Outline">
                  <path id="Vector" d="M15.8333 7.50008L15.2367 15.2557C15.1032 16.9924 13.655 18.3334 11.9132 18.3334H8.08677C6.34498 18.3334 4.89684 16.9924 4.76326 15.2557L4.16667 7.50008M17.5 5.83341C15.3351 4.7784 12.7614 4.16675 10 4.16675C7.23862 4.16675 4.66493 4.7784 2.5 5.83341M8.33333 4.16675V3.33341C8.33333 2.41294 9.07953 1.66675 10 1.66675C10.9205 1.66675 11.6667 2.41294 11.6667 3.33341V4.16675M8.33333 9.16675V14.1667M11.6667 9.16675V14.1667" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVideo;
