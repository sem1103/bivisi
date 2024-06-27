// MyVideo.js
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import useAxios from "../../../../utils/useAxios";
import { ProductContext } from "../../../../context/ProductContext";
import blueHeartd from "../../../../assets/icons/blue-heart.svg";
import edit from "../../../../assets/icons/edit.svg";
import trash from "../../../../assets/icons/trash.svg";
import "./style.scss";

const MyVideo = ({ productItem }) => {
  const { product, setProduct } = useContext(ProductContext);
  const axiosInstance = useAxios();
  const deletePost = async (id) => {
    try {
      await axiosInstance.delete(`/product_delete/${id}/`);
      setProduct((prevProduct) => ({
        ...prevProduct,
        results: prevProduct.results.filter((item) => item.id !== id),
      }));
      toast.success("Product successfully deleted");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="col-lg-4 pb-3">
      <div className="myVideoCard">
        <span className="card_price">$ {productItem?.price}</span>
        <img
          src={productItem.product_video_type[0].cover_image}
          alt=""
          className="main"
        />
        <NavLink to={`/product_detail/${productItem?.id}`} className="heading">
          <h1>{productItem.description}</h1>
          <h6>
            <img src={blueHeartd} alt="" />
            {productItem.like_count}
          </h6>
        </NavLink>
        <p>{productItem.name}</p>
        <div className="cardBottom">
          <span>{productItem.price}</span>
          <div className="icons">
            <NavLink to={`/your_profile/edit_video/${productItem.id}`} onClick={() => {
              localStorage.setItem('myEditVideo', JSON.stringify(productItem))
            }}>
              <img src={edit} alt="" />
            </NavLink>
            <button
              onClick={() => deletePost(productItem.id)}
              style={{
                background: "transparent",
                outline: "none",
                border: "none",
              }}
            >
              <img src={trash} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVideo;
