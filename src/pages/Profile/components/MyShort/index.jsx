import React, { useContext, useState, useEffect, useRef } from "react";
import "./style.scss";
import ReactPlayer from "react-player";
import { VideoContext } from "../../../../context/VideoContext";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { Modal } from "antd";
import delete_img from "../../../../assets/icons/delete.svg";
import edit from "../../../../assets/icons/edit.svg";
import { ProductContext } from "../../../../context/ProductContext";
import useAxios from "../../../../utils/useAxios";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import getCurrencyByCountry from "../../../../utils/getCurrencyService";

const MyShortCard = ({ productShortItem }) => {
  const [localPlaying, setLocalPlaying] = useState(false);
  const { playingVideo, setPlaying: setGlobalPlaying } =
    useContext(VideoContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  console.log(productShortItem);
  const { product, setProduct, countryCurrencySymbol } = useContext(ProductContext);
  const axiosInstance = useAxios();

  const deleteShortCard = async (id) => {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePlay = () => {
    if (playingVideo !== product.id) {
      setGlobalPlaying(product.id);
    }
    setLocalPlaying(!localPlaying);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    handlePlay();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setLocalPlaying(false);
  };

  const handleCardClick = (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLocalPlaying(false);
    setGlobalPlaying(null);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };

  const navigate = useNavigate();

  const handleMenuActionClick = (action, event) => {
    event.stopPropagation();
    if (action === "Edit") {
      navigate(`/your_profile/edit_short/${productShortItem.id}`);
      localStorage.setItem('myEditVideo', JSON.stringify(productShortItem))
    } else if (action === "Delete") {
      deleteShortCard(productShortItem.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="col-lg-3 col-md-4 col-sm-12 col-12 p-3">
      <div
        className="My_ShortCard"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <div className="wrapper">
          <div className="main">
            <img
              className={`coverImage ${isHovered ? "hidden" : ""}`}
              src={productShortItem.cover_image}
              alt="cover"
            />
            <HiOutlineDotsHorizontal
              className="menu-icon"
              onClick={toggleMenu}
            />
            <div ref={menuRef} className={`menu ${showMenu ? "open" : ""}`}>
              <button onClick={(e) => handleMenuActionClick("Edit", e)}>
                <img src={edit} alt="" />
              </button>
              <button onClick={(e) => handleMenuActionClick("Delete", e)}>
                <img src={delete_img} alt="" />
              </button>
            </div>
          </div>
          <div className="shortCard-content">
            <div className="text">
              <p>{productShortItem?.product.name}</p>
              <span>{productShortItem?.product.price}{countryCurrencySymbol}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyShortCard;
