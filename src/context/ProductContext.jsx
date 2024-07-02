import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { BASE_URL } from "../api/baseUrl";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [channelData, setChannelData] = useState({
    followersCount: 0,
    cover_image: "",
    avatar: "",
    username: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get(`${BASE_URL}/product/`);
        setProduct(res1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        selectedCategory,
        setSelectedCategory,
        channelData,
        setChannelData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
