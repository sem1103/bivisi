import React, { useContext, useState } from "react";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import "./style.scss";
import upload from "../../../../assets/icons/upload.svg";
import VideoIcon from "../../../../assets/icons/VideoIcon.svg";
import sort from "../../../../assets/icons/arrow-sort.svg";
import MyVideo from "../../components/MyVideo";
import { ProductContext } from "../../../../context/ProductContext";
import { AuthContext } from "../../../../context/authContext";
import { Link } from "react-router-dom";
import { Select } from "antd";
const MyVideos = () => {
  const { Option } = Select;
  const [selectedOption, setSelectedOption] = useState("");
  const { user } = useContext(AuthContext);
  const { product } = useContext(ProductContext);
  const hasProducts =
    product && Array.isArray(product.results) && product.results.length > 0;

  const activeUserProducts = hasProducts
    ? product.results.filter(
      (item) =>
        item.user.name === user.username &&

        item.product_video_type[0]?.product_type === "Video"
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

      <div className="my_video_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  my__videos flex-wrap">
              <h1>My videos</h1>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/your_profile/upload_video"
                  className="myvideo_upload"
                >
                  <img src={upload} alt="upload" />
                  <span>Upload</span>
                </Link>
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
                return <MyVideo productItem={item} key={item.id} />;
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

export default MyVideos;
