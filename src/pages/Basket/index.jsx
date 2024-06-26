import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import left from "../../assets/icons/Left-Arrow.svg";
import "./style.scss";
import img from "../../assets/images/Rectangle-basket.png";
import useAxios from "../../utils/useAxios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { IconPlus, IconMinus, IconX } from "@tabler/icons-react";
import { useCart } from "react-use-cart";

const Basket = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const { removeItem, items } = useCart();
  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        const response = await axiosInstance.get("/order/basket/");
        setBasketItems(response.data[0].items);
      } catch (error) {
        setError(error);
      }
    };
    fetchBasketItems();
    return () => {};
  }, []);

  const handleDeleteBasketItem = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/order/delete_basket_item/${id}/`
      );
      setBasketItems((prevItems) =>
        prevItems.filter((item) => item.product.id !== id)
      );
      let a = items.find((item) => item.id === id);
      removeItem(a.id);
      toast.success("Product removed from basket successfully!");
    } catch (error) {
      setError(error.response.data);
    }
  };

  const handleUpdateBasketItem = async (id, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        // Eğer yeni miktar 0'dan küçük veya eşitse, ürünü sepetten sil
        await handleDeleteBasketItem(id);
        return; // İşlemi sonlandır
      }

      const response = await axiosInstance.put(
        `/order/change_basket_item/${id}/`,
        {
          quantity: newQuantity,
        }
      );

      // Sepet öğelerini güncelle
      setBasketItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === id ? { ...item, quantity: newQuantity } : item
        )
      );

      toast.success("Product quantity updated successfully!");
    } catch (error) {
      setError(error.response.data);
      toast.error("An error occurred while updating product quantity.");
    }
  };

  const calculateTotalPrice = () => {
    return basketItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <div className="basket">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 pt-4 basket_head pb-4">
            <Link to="/your_profile">
              <img src={left} alt="left.icon" />
              Basket
            </Link>
          </div>

          <div className="col-lg-8">
            {basketItems?.map((item) => {
              return (
                <div className="d-flex basket_card mb-4" key={item.id}>
                  <div>
                    <img src={item.product.product_video_type[0].cover_image} />
                  </div>
                  <div className="basket_card_content d-flex p-2">
                    <div>
                      <p>{item?.product?.name}</p>
                      <span>
                        {Number(item?.product?.price) * item.quantity} AZN
                      </span>
                      <div className="d-flex align-items-center gap-3 pt-2">
                        <button
                          onClick={() =>
                            handleUpdateBasketItem(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                        >
                          <IconMinus stroke={2} />
                        </button>
                        <span>{item?.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateBasketItem(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                        >
                          <IconPlus stroke={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="close"
                    onClick={() => handleDeleteBasketItem(item.product.id)}
                  >
                    <IconX stroke={2} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-lg-4 ">
            <div className="basket_summary">
              <div>
                <h3 className="pb-3">Summary</h3>
                <div className="d-flex justify-content-between ">
                  <p>Lorem ipsum dolor sit amet consectetur</p>
                  <span>$ 1000</span>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Lorem ipsum dolor sit amet consectetur</p>
                  <span>$ 1000</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between py-3">
                  <p>Subtotal</p>
                  <span>$ 10</span>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Tax amount</p>
                  <span>$ 10</span>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Shipping cost</p>
                  <span>$ 10</span>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Discount 10%</p>
                  <span>- $ 10</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between py-3 total_basket">
                  <p>Total amount</p>
                  <span>{calculateTotalPrice()} AZN</span>
                </div>
                <Link to="/payment">Go to check out</Link>
              </div>
            </div>

            <div className="promo_code mt-3">
              <div>
                <h4>Promo code</h4>
                <div className="d-flex gap-3">
                  <input type="email" placeholder="Enter promo code" />
                  <button>Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
