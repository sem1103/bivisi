import React, { useContext, useEffect, useState } from "react";
import LastVideoCard from "../../components/VideoCard";
import { Select } from "antd";
import { ProductContext } from "../../context/ProductContext";
import "./style.scss";
import sort from "../../assets/icons/Sort.svg";
import useAxios from "../../utils/useAxios";
const Lastest_Videos = () => {
  const { Option } = Select;
  const axiosInstance = useAxios();
  const { product } = useContext(ProductContext);
  const [selectedOption, setSelectedOption] = useState("");

  if (
    !product ||
    !Array.isArray(product.results) ||
    product.results.length === 0
  ) {
    return null;
  }

  const sortedVideoProducts = [...product.results].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const latestVideoProducts = sortedVideoProducts.filter(
    (item) => item.product_video_type[0]?.product_type === "Video"
  );

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleAllClick = () => {
    setSelectedOption("");
  };


  const sortedProducts = [...latestVideoProducts];
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
      <section className="latest_videos">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center py-4">
              <h1>Latest videos</h1>
              <div className="d-flex align-items-center gap-4">
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
            {sortedProducts.map((item) => (
              <LastVideoCard ProductItemVideoCard={item} key={item.id} page="latestvideo"/>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Lastest_Videos;
