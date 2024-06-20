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
          item.product_video_type[0].product_type === "Shorts"
      )
    : [];

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleAllClick = () => {
    setSelectedOption("");
  };

  const sortedProducts = [...activeUserProducts];
  if (selectedOption === "option1") {
    sortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
  } else if (selectedOption === "option2") {
    sortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
  } else if (selectedOption === "option3") {
    sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (selectedOption === "option4") {
    sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }
  return (
    <>
      <Main />
      <Categories />
      <div className="shorts_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  flex-wrap shorts__categories">
              <h1>Shorts</h1>
              <div className="d-flex gap-3  flex-wrap">
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
                  <Select
                    defaultValue=""
                    value={selectedOption}
                    onChange={handleSelect}
                    suffixIcon={null}
                    className="select"
                    popupClassName="custom-dropdown"
                    prefixicon={<img src={sort} alt="plus.svg" width={20} />}
                  >
                    <Option value="" onClick={handleAllClick}>
                      All
                    </Option>
                    <Option value="option1">A to Z</Option>
                    <Option value="option2">Z to A</Option>
                    <Option value="option3">From cheap to expensive</Option>
                    <Option value="option4">From expensive to cheap</Option>
                  </Select>
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
