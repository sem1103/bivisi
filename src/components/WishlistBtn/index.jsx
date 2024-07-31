import React, { useContext, useEffect, useState } from "react";
import { handleToggleWishlist } from "../../helpers";
import useAxios from "../../utils/useAxios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";

const WishBtn = ({ ProductItemVideoCard }) => {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const [in_wishlist, set_in_wishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ProductItemVideoCard) {
      const wishlistState = JSON.parse(localStorage.getItem("wishlist")) || {};
      set_in_wishlist(wishlistState[ProductItemVideoCard.id] || false);
    }
  }, [ProductItemVideoCard]);

  useEffect(() => {
    const updateWishlistState = (event) => {
      const { productId, status } = event.detail;
      if (productId === ProductItemVideoCard?.id) {
        set_in_wishlist(status);
      }
    };

    window.addEventListener("wishlistUpdate", updateWishlistState);

    return () => {
      window.removeEventListener("wishlistUpdate", updateWishlistState);
    };
  }, [ProductItemVideoCard?.id]);

  const handleWishlistToggle = async (product) => {
   
    if (!user) {
      toast.warning("Please sign in");
    } else if (user.user_id === product.user.id) {
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

  if (!ProductItemVideoCard) return null;

  return (
    <button
    onClick={() => handleWishlistToggle(ProductItemVideoCard)}
      style={{ cursor: loading ? "not-allowed" : "pointer" }}>
        {
          in_wishlist ? 
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.52422L10.765 1.70229C12.8777 -0.567429 16.3029 -0.567429 18.4155 1.70229C20.5282 3.972 20.5282 7.65194 18.4155 9.92165L11.5301 17.3191C10.685 18.227 9.31495 18.227 8.4699 17.3191L1.58447 9.92165C-0.528156 7.65194 -0.528155 3.972 1.58447 1.70229C3.69709 -0.56743 7.12233 -0.567428 9.23495 1.70229L10 2.52422ZM15 2.25C14.5858 2.25 14.25 2.58579 14.25 3C14.25 3.41421 14.5858 3.75 15 3.75C15.6904 3.75 16.25 4.30964 16.25 5C16.25 5.41421 16.5858 5.75 17 5.75C17.4142 5.75 17.75 5.41421 17.75 5C17.75 3.48122 16.5188 2.25 15 2.25Z" fill="#bebebe"/>
</svg>

          : 
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Icon/Heart/On">
          <path id="Vector" d="M14.167 5.41658C15.0874 5.41658 15.8336 6.16278 15.8336 7.08325M10.0003 4.75203L10.5712 4.16659C12.347 2.34551 15.2261 2.34551 17.0018 4.16658C18.7299 5.93875 18.783 8.79475 17.1221 10.6332L12.3501 15.9151C11.0824 17.3182 8.91827 17.3182 7.65054 15.9151L2.8786 10.6332C1.21764 8.79478 1.27074 5.93877 2.99882 4.1666C4.7746 2.34552 7.65369 2.34552 9.42946 4.1666L10.0003 4.75203Z" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          </svg>
          
        }
    </button>
   
  );
};

export default WishBtn;
