import React, { useContext, useEffect, useState } from "react";
import heartOn from "../../assets/icons/heart-on.svg";
import heartFull from "../../assets/icons/Subtract.svg";
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
    <img
      src={in_wishlist ? heartFull : heartOn}
      alt="wishlist"
      onClick={() => handleWishlistToggle(ProductItemVideoCard)}
      style={{ cursor: loading ? "not-allowed" : "pointer" }}
    />
  );
};

export default WishBtn;
