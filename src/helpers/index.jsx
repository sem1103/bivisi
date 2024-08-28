import { toast } from "react-toastify";

export const handleToggleWishlist = async (id, axiosInstance) => {
  try {
    let res = await axiosInstance.post(`/order/toggle_favorite/${id}/`);
    if (res.data.message === "Product removed from favorites.") {
      toast.error("You Dislike Product!");
      // Emit custom event
      const event = new CustomEvent("wishlistUpdate", {
        detail: { productId: id, status: false },
      });
      window.dispatchEvent(event);
      return false; // Return new status
    } else {
      toast.success("You Like Product!");
      // Emit custom event
      const event = new CustomEvent("wishlistUpdate", {
        detail: { productId: id, status: true },
      });
      window.dispatchEvent(event);
      return true; // Return new status
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

export const handleAddToBasket = async (product, user, axiosInstance) => {
  if (!user) {
    toast.warning("Please sign in");
  } else {
    try {
      const response = await axiosInstance.post(
        `/order/add_basket_item/${product.id}/`
      );
      console.log("Product added to basket:", response.data);
      toast.success("Product succesfully to your basket");
    } catch (error) {
      console.log(error);
    }
  }
};

export const toggleLike = async (
  id,
  axiosInstance,
  setLiked,
  setProduct,
  user
) => {
  if (!user) {
    toast.warning("Please, sign in");
  }
  try {
    let res = await axiosInstance.post(`/toggle_product_like/${id}/`);
    const response = await axiosInstance.get(`/product/${id}/`);

    if (res.status === 201) {
      toast.success("You Like Short!");
      setLiked(true);
    } else {
      setLiked(false);
      toast.error("You Dislike Short!");
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      results: prevProduct.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            like_count: response.data.like_count,
            is_liked: response.data.is_liked,
          };
        }
        return item;
      }),
    }));
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};
