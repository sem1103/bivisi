import React, { useContext, useEffect, useState } from "react";
import LastVideoCard from "../../components/VideoCard";
import { ProductContext } from "../../context/ProductContext";
import "./style.scss";

import cameraOutline from "../../layout/Sidebar/icons/camera-outline.svg";
import Select from 'react-select';
import CustomSingleValue from "../Profile/pages/CustomSymbol";

const Lastest_Videos = () => {
  const { product } = useContext(ProductContext);

  if (
    !product ||
    !Array.isArray(product.results) ||
    product.results.length === 0
  ) {
    return null;
  }


  const [selectedOption, setSelectedOption] = useState("");


  const [sortedProducts, setSortedProducts] = useState(product?.results.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  ).filter(
    (item) => item.product_video_type[0]?.product_type === "Video"
  ))

  const handleSelect = (value) => {
    setSelectedOption(value.value);
  };




  const selectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      cursor: 'pointer',
      background: 'var(--primaryColor)',
      borderRadius: '16px',
      minWidth: '230px',
      textAlign: 'center',
      '@media (max-width: 600px)': {
      minWidth: '100px',
      maxWidth: '120px',
    }
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? '#0087cc' : isFocused ? 'var(--backgroundColor)' : 'none',
      color: 'var(--textColor)',
      cursor: 'pointer',
      margin: '0 0 5px 0',
      borderRadius: '8px'
    }),
    menu: (styles) => (
      {
        ...styles, 
        borderRadius: '12px',
        background: 'var(--primaryColor)',
        minWidth: '150px',
        right: 0, // Смещение меню вправо
        zIndex: 999
      }
    ),
    menuList: (styles) => ({
      ...styles,
      opacity: 0.7,
      padding: '5px 10px',

    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'var(--textColor)',
    }),
    placeholder: (styles) => ({
      ...styles,
      color: 'var(--textColor)',
      opacity: 0.8
    })
  }

  const filters = [
    {
      value: '',
      label: 'All'
    },
    {
      value: 'option1',
      label: 'A to Z'
    },
    {
      value: 'option2',
      label: 'Z to A'
    }
    ,{
      value: 'option3',
      label: 'From cheap to expensive'
    }
    ,{
      value: 'option4',
      label: 'From expensive to cheap'
    }
  ]

  useEffect(() => {
    
    let sortedArray = [...sortedProducts]; 
    if (selectedOption === "option1") {
      sortedArray.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (selectedOption === "option2") {
      sortedArray.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else if (selectedOption === "option3") {
      sortedArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (selectedOption === "option4") {
      sortedArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }else {
      sortedArray = product?.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ).filter(
        (item) => item.product_video_type[0]?.product_type === "Video"
      )
    }
  
    setSortedProducts(sortedArray); 
    
  }, [selectedOption]);


 
  return (
    <>
      <section className="latest_videos">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center section_title">
              <div className="d-flex align-items-center gap-2">
                <img width={27} src={cameraOutline} alt="" />
                <h4 className="mt-1">Latest videos</h4>
              </div>
              <div className="d-flex align-items-center gap-4">
                <div className="custom-select">
                <Select
                defaultValue={filters[0]}
                placeholder='All'
                  styles={selectStyles}
                  options={filters}
                  onChange={handleSelect}
                  menuPlacement="auto"
                  isSearchable={false}
                  components={{ SingleValue: CustomSingleValue }}

                />
                </div>
              </div>
            </div>
            {sortedProducts.map((item) => (
              <LastVideoCard ProductItemVideoCard={item} key={item.id} page="latestvideo" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Lastest_Videos;
