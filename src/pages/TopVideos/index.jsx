import React, { useContext, useEffect, useState } from 'react';
import './style.scss';
import sort from '../../assets/icons/Sort.svg'
import LastVideoCard from '../../components/VideoCard';
import { ProductContext } from '../../context/ProductContext';
import useAxios from '../../utils/useAxios';
import videoOutline from "../../layout/Sidebar/icons/video-outline.svg";
import { Modal } from 'antd';
import getCurrencyByCountry from '../../utils/getCurrencyService';
import axios from 'axios';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { BASE_URL } from '../../api/baseUrl';
import Select from 'react-select';
import CustomSingleValue from '../Profile/pages/CustomSymbol';
import Cookies from 'js-cookie';
import { CModal } from '@coreui/react';



const TopVideos = () => {
    const {countryCurrencySymbol, productsCount} = useContext(ProductContext)
    const [selectedOption, setSelectedOption] = useState('');
    const [originalVideos, setOriginalVideos ] = useState([])
    const [videoProducts, setVideoProducts] = useState([]);
    const [viewMyVideos, setViewMyVideos] = useState([]);
    const [selectedVideos, setSelectedVideos] = useState([])
    const [step, setStep] = useState(0)
    const [isOpen, setIsOpen] = useState(false);
    const premiumPrice = 50;
    const [summPremiumPrice, setSummPremiumPrice] = useState(premiumPrice);
    const [dayCounter, setDayCounter] = useState(1);
    const [isPay, setIsPay] = useState(undefined);
    const axiosInstance = useAxios();


    const getData = async () => {
        let res = await axios.get(`${BASE_URL}/product/?product_type=Video&limit=${productsCount}`);
        
        let data = res.data.results
        setOriginalVideos(data)
        setVideoProducts(data);
        setViewMyVideos(data)
        
    }

    useEffect(() => {
        productsCount && getData();

    }, [productsCount])


    const addPremiumVideoHandler = async (videosId) => {
        try {
            axiosInstance.put('/update_premium_products/', { product_ids: videosId });
            setIsPay(true);
        } catch (error) {
            console.log(error);
        }
    }

    const searchMyVideos = (name) => {
        setViewMyVideos(videoProducts.filter(item => item.name.toLowerCase().includes(name.toLowerCase())))
    }

    const validateOneStep = () => {
        if (selectedVideos.length) return true;
        else toast.error('Please select at least one video')
    }

    const nextStep = () => {
        (validateOneStep() && !step) && setStep(1);
        step == 1 && setStep(2);
    }

    const handleCheckboxClick = (item) => {
        setSelectedVideos(prev => {
            if (prev.includes(item.id)) {
                return prev.filter(vidId => vidId !== item.id);
            } else {
                return [...prev, item.id];
            }
        });
    };


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
        let sortedArray = [...videoProducts]; 
      
        if (selectedOption === "option1") {
          sortedArray.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else if (selectedOption === "option2") {
          sortedArray.sort((a, b) => (a.name < b.name ? 1 : -1));
        } else if (selectedOption === "option3") {
          sortedArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (selectedOption === "option4") {
          sortedArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else{
            setVideoProducts(originalVideos); 
           return
        }
      
        setVideoProducts(sortedArray); 
      }, [selectedOption]);




    return (
        <div className='top_page_videos'>
            <div className="container-fluid">
                <div className="row">
                    <div className="section_title col-lg-12 d-flex align-items-center  flex-wrap page__top">
                        <div className='d-flex align-items-center gap-2'>
                            <img width={27} src={videoOutline} alt="" />
                            <h4 className='mt-1'>Top videos</h4>
                        </div>

                        <div className="right_tools align-items-center ">
                           {
                            Cookies.get('authTokens') &&
                             <button
                             className='add__video'
                             onClick={() => {
                                 let array = viewMyVideos.map(item => item.user.name == JSON.parse(Cookies.get('authTokens')).username && !item.is_premium);
                                 if (array.some(item => item == true)) setIsOpen(!isOpen)
                                 else toast.error('All your videos are premium, please upload a new video..')

                             }}
                         >
                             + <span>Add premium video</span>
                         </button>
                           }
                           
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
                           
                            <CModal visible={isOpen} onClose={() => setIsOpen(false)} alignment='center'
                                className={'modal__body'}
                                >
                                    <button
        className="close__modal stroke__change"
        onClick={() => {
            setIsOpen(false)
        }}
        >
        <svg width={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
        </button>
                                <div className="premium__modal">
                                    {
                                        isPay == undefined &&
                                        <div className="steps__indigator">
                                            <hr className={`step active__step`} />
                                            <hr className={`step ${step == 1 || step == 2 ? 'active__step' : ''}`} />
                                            <hr className={`step ${step == 2 ? 'active__step' : ''}`} />
                                        </div>
                                    }
                                    {
                                        step == 0 &&
                                        <div className='step__one'>
                                            <h3>Choose your video</h3>
                                            <div id="search__my__video">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <g clipPath="url(#clip0_2547_16134)">
                                                        <path d="M15.417 15.4167L18.3337 18.3334M17.5003 9.58342C17.5003 5.21116 13.9559 1.66675 9.58366 1.66675C5.2114 1.66675 1.66699 5.21116 1.66699 9.58342C1.66699 13.9557 5.2114 17.5001 9.58366 17.5001C13.9559 17.5001 17.5003 13.9557 17.5003 9.58342Z" stroke="var(--textColor)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2547_16134">
                                                            <rect width="20" height="20" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <input type="text" name="" placeholder='Search for videos' onInput={e => searchMyVideos(e.target.value)} />
                                            </div>

                                            <div id="my__videos">

                                                {
                                                    viewMyVideos.length && Cookies.get('authTokens') ?
                                                    
                                                        viewMyVideos.map(item => {
                                                            if (item.user.name == JSON.parse(Cookies.get('authTokens')).username && !item.is_premium) {
                                                                return <div key={item.id} className="video__item">
                                                                    <div className="cover__img">
                                                                        <div>
                                                                        <img src={item.product_video_type[0].cover_image} alt="" />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="video__desc">
                                                                            <h4 className='video__name'>{item.name}</h4>
                                                                            <p className="video__price">{`${countryCurrencySymbol} ${item.price}`}</p>
                                                                        </div>
                                                                        <div className="video__checkbox">
                                                                            <label className="container" >
                                                                                <input type="checkbox" onChange={(e) => {
                                                                                    handleCheckboxClick(item)
                                                                                }}
                                                                                    checked={selectedVideos.includes(item.id)}

                                                                                />
                                                                                <svg viewBox="0 0 64 64" height="2em" width="2em">
                                                                                    <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path"></path>
                                                                                </svg>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }

                                                        })
                                                        :
                                                        <h5>Nothing was found</h5>
                                                }

                                            </div>
                                        </div>
                                    }

                                    {
                                        step == 1 &&
                                        <div className='step__two'>
                                            <h3>Details</h3>

                                            <div className="packet__details">
                                                <div className="days">
                                                    <h6>Number of days </h6>
                                                    <div className="day__counter">
                                                        <button className='dec__day' onClick={() => {
                                                            if (dayCounter > 1) setDayCounter(dayCounter - 1)
                                                        }}>
                                                            -
                                                        </button>
                                                        <p className="days">{dayCounter}</p>
                                                        <button className='inc__day' onClick={() => setDayCounter(dayCounter + 1)}>
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="price__display">
                                                    <h6>Price</h6>
                                                    <p>  {`${summPremiumPrice * dayCounter} ${countryCurrencySymbol}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        (step == 2 && isPay == undefined) &&
                                        <>
                                            <div className='step__three'>
                                                <h3>Payment</h3>
                                                <div className="cart__form">
                                                    <div className="cart__numb">
                                                        <p>Card number</p>
                                                        <InputMask mask="9999 9999 9999 9999" placeholder='1234 5678 9123 4567'>
                                                            {(inputProps) => <input {...inputProps} type="numb" />}
                                                        </InputMask>
                                                    </div>
                                                    <div className="cart__date__cvc">
                                                        <div className="cart__date">
                                                            <p>Expiration Date</p>
                                                            <InputMask mask="99/99" placeholder='12/24'>
                                                                {(inputProps) => <input {...inputProps} type="numb" />}
                                                            </InputMask>
                                                        </div>
                                                        <div className="cart__cvc">
                                                            <p>CVC</p>
                                                            <InputMask mask="999" placeholder='123'>
                                                                {(inputProps) => <input {...inputProps} type="numb" />}
                                                            </InputMask>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                        </>

                                    }

                                    {
                                        isPay == true &&
                                        <div className="info__pay">
                                            <div className="info__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M47.9997 5.33325H15.9997C10.1086 5.33325 5.33301 10.1089 5.33301 15.9999V47.9999C5.33301 53.891 10.1086 58.6666 15.9997 58.6666H47.9997C53.8907 58.6666 58.6663 53.891 58.6663 47.9999V15.9999C58.6663 10.1089 53.8907 5.33325 47.9997 5.33325ZM44.2451 25.2279C44.9232 24.356 44.7661 23.0994 43.8942 22.4213C43.0223 21.7432 41.7658 21.9002 41.0877 22.7721L30.4023 36.5104C30.1647 36.8159 29.7178 36.8556 29.4301 36.5967L22.671 30.5134C21.8499 29.7745 20.5854 29.8411 19.8464 30.6621C19.1075 31.4831 19.1741 32.7477 19.9951 33.4866L26.7542 39.5698C28.7679 41.3821 31.8965 41.1046 33.5597 38.9662L44.2451 25.2279Z" fill="#0385CA" />
                                                </svg>
                                            </div>
                                            <h6>Payment completed</h6>
                                            <p>We are thrilled to offer you our range of products.</p>
                                        </div>
                                    }
                                    {
                                        isPay == false &&
                                        <div className="info__pay ">
                                            <div className="info__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.9997 5.33325H47.9997C53.8907 5.33325 58.6663 10.1089 58.6663 15.9999V47.9999C58.6663 53.891 53.8907 58.6666 47.9997 58.6666H15.9997C10.1086 58.6666 5.33301 53.891 5.33301 47.9999V15.9999C5.33301 10.1089 10.1086 5.33325 15.9997 5.33325ZM40.9564 23.0434C41.7374 23.8244 41.7374 25.0907 40.9564 25.8718L34.8283 31.9999L40.9564 38.128C41.7374 38.9091 41.7374 40.1754 40.9564 40.9565C40.1753 41.7375 38.909 41.7375 38.128 40.9565L31.9998 34.8283L25.8714 40.9567C25.0904 41.7378 23.824 41.7378 23.043 40.9567C22.2619 40.1757 22.2619 38.9094 23.043 38.1283L29.1714 31.9999L23.043 25.8715C22.262 25.0905 22.262 23.8241 23.043 23.0431C23.8241 22.262 25.0904 22.262 25.8714 23.0431L31.9998 29.1715L38.1279 23.0434C38.909 22.2623 40.1753 22.2623 40.9564 23.0434Z" fill="#DC1818" />
                                                </svg>
                                            </div>
                                            <h6>Oops!</h6>
                                            <p>Something went wrong...</p>
                                        </div>
                                    }


                                    <div className="modal__btns">
                                        {
                                            step && isPay == undefined ?
                                                <button className='cancel' onClick={() => setStep(step - 1)}>
                                                    Back
                                                </button>
                                                :
                                                isPay == undefined ?
                                                    <button className='cancel' onClick={() => setIsOpen(!isOpen)}>
                                                        Cancel
                                                    </button>
                                                    :
                                                    ''
                                        }

                                        {
                                            (step == 2 && isPay == undefined) ?
                                                <button className='next__btn' onClick={() => addPremiumVideoHandler(selectedVideos)}>
                                                    Pay
                                                </button>
                                                :
                                                isPay == undefined ?
                                                    <button className='next__btn' onClick={nextStep}>
                                                        Next
                                                    </button>
                                                    :
                                                    isPay ?
                                                        <button className='finish__btn next__btn' onClick={() => {
                                                            setIsOpen(!isOpen);
                                                            setIsPay(undefined);
                                                            setSelectedVideos([]);
                                                            setStep(0);
                                                            getData();
                                                        }}>
                                                            Done
                                                        </button>
                                                        :
                                                        <button className='try__btn next__btn' onClick={() => {
                                                            setStep(step - 1)
                                                            setIsPay(undefined);
                                                        }}>
                                                            Try again
                                                        </button>


                                        }


                                    </div>
                                </div>
                            </CModal>

                        </div>


                    </div>
                    {
                        videoProducts.map((item) => (
                            item.is_premium && <LastVideoCard ProductItemVideoCard={item} key={item.id} page="topvideo" />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TopVideos