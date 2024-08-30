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
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";
import Cookies from 'js-cookie';
import { useInView } from 'react-intersection-observer';



const Shorts = () => {
  const { Option } = Select;
  const [selectedOption, setSelectedOption] = useState("");
  const { user } = useContext(AuthContext);
  const [ myProduct, setMyProduct] = useState([]);
  const [productCount, setProductCount] = useState(0)
  const [productsPaginCount, setProductsPaginCount] = useState(0);

  const USER_TOKKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;
  const { ref, inView } = useInView({
    threshold: 0.5,      // Триггер срабатывает, когда 10% элемента видны
  });

  const getMyProducts = async (offset) => {
    const res = await axios.get(`${BASE_URL}/user_web_products/?product_type=Shorts&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${USER_TOKKEN}`
      }
    })
    setMyProduct(prev => prev.length ? [...prev, ...res.data.results] : res.data.results);
    setProductCount(res.data.count)

  }

  useEffect(() => {
    getMyProducts()
  }, []);

 
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

      
      
    }
    
   
  }, [myProduct]);

  const onScrollEnd = () => {
    setProductsPaginCount(prevCount => {
        const newCount = myProduct.length != productCount && prevCount + 1;
        myProduct.length != productCount &&  getMyProducts(newCount * 12);
        return newCount;
    });
}
useEffect(() => {
    if (inView) {
        onScrollEnd();
    }
}, [inView]);


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
                return <MyShortCard productShortItem={item} key={item.id} productCount={productCount} />;
              })
            ) : (
              <div className="no_product">
                <img src={VideoIcon} alt="" />
              </div>
            )}

        {
           myProduct.length > 0 && myProduct.length != productCount &&
            <div className="loading" ref={ref}>
              <div className="wrapper" >
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
              </div>
            </div>

          }

          </div>
        </div>
      </div>
    </>
  );
};

export default Shorts;
