import React, { useContext, useEffect, useState } from 'react';
import './style.scss';
import sort from '../../assets/icons/Sort.svg'
import LastVideoCard from "../../components/VideoCard";
import { ProductContext } from '../../context/ProductContext';
import Select from 'react-select';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
import trendOutline from "../../layout/Sidebar/icons/trend-outline.svg";
import CustomSingleValue from '../Profile/pages/CustomSymbol';
import { useInView } from 'react-intersection-observer';


const Trending = () => {
    const [trendVideo, setTrendVideo] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [originalVideos, setOriginalVideos ] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const { ref, inView } = useInView({
      threshold: 0.5,      // Триггер срабатывает, когда 10% элемента видны
    });
    const [productsPaginCount, setProductsPaginCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);

    const fetchData = async (offset) => {
        try {
            const response = await axios.get(`${BASE_URL}/web_trending_videos/?offset=${offset}`);
            setProductsCount(response.data.count)
            let data = response.data.results.filter(
              (item) => item.product_video_type[0]?.product_type === "Video"
          )
          setAllProducts(prev => prev.length ? [...prev, ...response.data.results] : response.data.results);
       
            
            setTrendVideo(prev => prev.length ? [...prev, ...data] : data);
            setOriginalVideos(prev => prev.length ? [...prev, ...data] : data);
      
            
           
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }
    useEffect(() => {
        
        fetchData(0);
    }, [])

    const handleSelect = (value) => {
        setSelectedOption(value.value);
    };

    const handleAllClick = () => {
        setSelectedOption('');
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
        let sortedArray = [...trendVideo]; 
      
        if (selectedOption === "option1") {
          sortedArray.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else if (selectedOption === "option2") {
          sortedArray.sort((a, b) => (a.name < b.name ? 1 : -1));
        } else if (selectedOption === "option3") {
          sortedArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (selectedOption === "option4") {
          sortedArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else{
            setTrendVideo(originalVideos); 
           return
        }
      
        setTrendVideo(sortedArray); 
      }, [selectedOption]);


      const onScrollEnd = () => {
        setProductsPaginCount(prevCount => {
            const newCount = allProducts.length != productsCount && prevCount + 1;
            allProducts.length != productsCount &&  fetchData(newCount * 12);
            return newCount;
        });
    }
    useEffect(() => {
        if (inView) {
            onScrollEnd();
        }
    }, [inView]);


    return (
        <div className='trending_videos'>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-between align-items-center section_title">
                        <div className='d-flex align-items-center gap-2'>
                            <img width={27} src={trendOutline} alt="" />
                            <h4 className='heading_trend  mt-1'>Trending</h4>
                        </div>
                        {/* <button className='sort_btn'>
                            <img src={sort} alt="plus.svg" />
                            Sort by
                        </button> */}

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
                    {
                        trendVideo?.map((item) => (
                            <LastVideoCard ProductItemVideoCard={item} key={item.id} page="trendvideo" />
                        ))
                    }

{
                  allProducts.length != productsCount  &&
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
    );
};
export default Trending;