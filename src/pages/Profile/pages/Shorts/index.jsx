import React, { useContext, useState , useEffect} from "react";
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
  const { myProduct } = useContext(ProductContext);

 
  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleAllClick = () => {
    setSelectedOption("");
  };

  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    if(myProduct){
      setSortedProducts(myProduct?.filter(item => {
    
        if(item.product_type === "Shorts") return item;
          
      }))

      console.log(myProduct?.filter(item => {
    
        if(item.product_type === "Shorts") return item;
          
      }));
      
    }
    
   
  }, [myProduct]);
console.log(sortedProducts,myProduct)
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
                  {
                    sortedProducts &&
                    <SortProduct sortedProducts={sortedProducts} setSortedProducts={setSortedProducts}/>

                  }
                </div>
              </div>
            </div>

            {sortedProducts ? (
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
