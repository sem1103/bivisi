import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { BASE_URL } from "../api/baseUrl";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
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
