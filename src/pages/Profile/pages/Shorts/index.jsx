import React, { useContext, useState } from "react";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import "./style.scss";
import upload from "../../../../assets/icons/upload.svg";
import sort from "../../../../assets/icons/arrow-sort.svg";
import ShortCard from "../../../../components/ShortCard";
import { AuthContext } from "../../../../context/authContext";
import { ProductContext } from "../../../../context/ProductContext";
import VideoIcon from "../../../../assets/icons/VideoIcon.svg";
import { Select } from "antd";
import { Link } from "react-router-dom";
import MyShortCard from "../../components/MyShort";
import SortProduct from "../../../../components/SortProduct";
const Shorts = () => {
  const { Option } = Select;
  const [selectedOption, setSelectedOption] = useState("");
  const { user } = useContext(AuthContext);
  const { product } = useContext(ProductContext);
  const hasProducts =
    product && Array.isArray(product.results) && product.results.length > 0;

  // Ürün dizisi yoksa veya ürün dizisi boşsa, boş bir dizi oluştur
  const activeUserProducts = hasProducts
    ? product.results.filter(
        (item) =>
          item.user.name === user.username &&

          item.product_video_type[0]?.product_type === "Shorts"
      )
    : [];

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleAllClick = () => {
    setSelectedOption("");
  };

  const [sortedProducts, setSortedProducts] = useState([...activeUserProducts]);

  return (
    <>
      <Main />
      <Categories />
      <div className="shorts_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  flex-wrap shorts__categories">
              <h1>Shorts</h1>
              <div className="d-flex gap-3  flex-wrap align-items-center">
                <Link
                  to="/your_profile/upload_shorts"
                  className="shorts_upload"
                >
                  <img src={upload} alt="upload" />
                  <span>Upload</span>
                </Link>
                {/* <div className="shorts-sort">
                  <img src={sort} alt="sort" />
                  Sort by
                </div> */}
                <div className="custom-select">
                <SortProduct sortedProducts={sortedProducts} setSortedProducts={setSortedProducts}/>
                </div>
              </div>
            </div>

            {sortedProducts && sortedProducts.length > 0 ? (
              sortedProducts.map((item) => {
                return <MyShortCard productShortItem={item} key={item.id} />;
              })
            ) : (
              <div className="no_product">
                <img src={VideoIcon} alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shorts;
