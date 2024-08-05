import React, { useContext } from "react";
import "./style.scss";
import { useLocation } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";

const Categories = () => {
  const location = useLocation();
  const { pathname } = location;
  const { selectedCategory, setSelectedCategory, category } = useContext(ProductContext);
  const isExcludedPath = () => {
    const excludedPaths = [];

    let flag = excludedPaths.some(item => pathname.includes(item));

    if (flag) {
      return true;
    }

    const dynamicPaths = [
      /^\/product_detail\/\d+$/
    ];

    return dynamicPaths.some((pattern) => pattern.test(pathname));
  };

  if (isExcludedPath()) {
    return null;
  }

  return (
    <section className="b_categories ">
      <div className="container-fluid d-flex align-items-center b_cat">
        <button
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === "All" ? "selected" : ""}
        >
          All
        </button>
        
        {category?.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCategory(item.id)}
            className={selectedCategory === item.id ? "selected" : ""}
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
};
export default Categories;
