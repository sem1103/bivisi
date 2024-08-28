import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";
import { BASE_URL } from "../api/baseUrl";
import Cookies from 'js-cookie';
import { useJsApiLoader } from "@react-google-maps/api";
import { useInView } from 'react-intersection-observer';
import getCurrencyByCountry from "../utils/getCurrencyService";


export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const {currencyCode, countryCurrencySymbol} = getCurrencyByCountry();
  console.log(countryCurrencySymbol);
  
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
  const { ref, inView } = useInView({
    threshold: 0.5,      // Триггер срабатывает, когда 10% элемента видны
  });
  const [productsPaginCount, setProductsPaginCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);


  const applyFilter = (selectedCategory, minPrice, maxPrice) => {
    let filtered = product || [];
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered?.filter(item => item.category.includes(Number(selectedCategory)));
    }

    if (minPrice !== 0 || maxPrice !== 0) {
      filtered = filtered?.filter(item => Number(item.price) >= minPrice && Number(item.price) <= maxPrice);
    }

    setFilteredProducts(filtered);
  };

  const fetchAllData = async (offset) => {
    try {
      const res = await axios.get(`${BASE_URL}/product/?offset=${offset}`);  
      setProduct(product.length ? prev => [...prev, ...res.data.results] : res.data.results);
      setFilteredProducts(filteredProducts.length ? prev => [...prev, ...res.data.results] : res.data.results);

      setProductsCount(res.data.count)


    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

    fetchAllData(0);
  }, []);


  const onScrollEnd = () => {
    setProductsPaginCount(prevCount => {
        const newCount = product.length != productsCount && prevCount + 1;
        product.length != productsCount &&  fetchAllData(newCount * 12);
        return newCount;
    });
}
useEffect(() => {
    if (inView) {
        onScrollEnd();
    }
}, [inView]);

  return (
    <ProductContext.Provider
      value={{
        product,
        ref,
        inView,
        isLoaded,
        myProduct,
        productsCount,
        filteredProducts,
        productsPaginCount,
        currencyCode, 
        countryCurrencySymbol,
        setProduct,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        fetchAllData,
        category,
        setCategory,
        getMyProducts,
        applyFilter,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
