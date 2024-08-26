import React, { useContext, useState , useEffect} from "react";
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

import SortProduct from "../../../../components/SortProduct";




const MyVideos = () => {
  const { myProduct } = useContext(ProductContext);
  const [sortedProducts, setSortedProducts] = useState([])

  




  useEffect(() => {
    if(myProduct){
      setSortedProducts(myProduct?.filter(item => {
    
        if(item.product_type === "Video") return item;
          
      }))     
    }
    
   
  }, [myProduct]);

    

  return (
    <>
      <Main />
      <Categories />

      <div className="my_video_profile">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center pb-4  my__videos flex-wrap">
              <h1>My videos</h1>
              <div className="d-flex gap-3 flex-wrap align-items-center">
                <Link
                  to="/your_profile/upload_video"
                  className="myvideo_upload"
                >
                  <img src={upload} alt="upload" />
                  <span>Upload</span>
                </Link>
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
