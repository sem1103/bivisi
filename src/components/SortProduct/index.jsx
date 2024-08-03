import React, { useEffect, useState } from 'react'
import { Select } from "antd";
import './style.scss'
import CustomSingleValue from '../../pages/Profile/pages/CustomSymbol';
import Select from 'react-select';


const SortProduct = ({ sortedProducts, setSortedProducts }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const handleSelect = (value) => {
        setSelectedOption(value.value);
    };

    const handleAllClick = () => {
        setSelectedOption("");
    };

    const selectStyles = {
        control: (baseStyles) => ({
          ...baseStyles,
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
          sortedArray.sort((a, b) => (a.product.name > b.product.name ? 1 : -1));
        } else if (selectedOption === "option2") {
          sortedArray.sort((a, b) => (a.product.name < b.product.name ? 1 : -1));
        } else if (selectedOption === "option3") {
          sortedArray.sort((a, b) => parseFloat(a.product.price) - parseFloat(b.product.price));
        } else if (selectedOption === "option4") {
          sortedArray.sort((a, b) => parseFloat(b.product.price) - parseFloat(a.product.price));
        }
      
        setSortedProducts(sortedArray); 
      }, [selectedOption]);


    return (
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
     
    )
}

export default SortProduct;
