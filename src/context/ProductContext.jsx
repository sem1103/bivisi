import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { BASE_URL } from "../api/baseUrl";
import Cookies from 'js-cookie';
import { useJsApiLoader } from "@react-google-maps/api";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const USER_TOKKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDSalM865lZHc8e3B7a0KWSCJKzGm7m37Q",
    libraries: ['places']
  })
  const [product, setProduct] = useState([]);
  const [myProduct, setMyProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [category, setCategory] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const applyFilter = (selectedCategory, minPrice, maxPrice) => {
    let filtered = product?.results || [];
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered?.filter(item => item.category.includes(Number(selectedCategory)));
    }

    if (minPrice !== 0 || maxPrice !== 0) {
      filtered = filtered?.filter(item => Number(item.price) >= minPrice && Number(item.price) <= maxPrice);
    }

    setFilteredProducts(filtered);
  };

  const getMyProducts = async () => {
    const res = await axios.get(`${BASE_URL}/user_web_products/`, {
      headers: {
          Authorization: `Bearer ${USER_TOKKEN}`
      }
  })
  setMyProduct(res.data.results);
  
  
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(`${BASE_URL}/categories/`);
        setCategory(categoryRes?.data.results);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    getMyProducts()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/product/`);
     
        setProduct(res.data);
        setFilteredProducts(res.data.results); 
        
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
        isLoaded,
        myProduct,
        filteredProducts,
        setProduct,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        category,
        setCategory,
        applyFilter,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
