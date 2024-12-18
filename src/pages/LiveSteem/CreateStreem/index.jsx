import { useState, useEffect, useRef, useContext } from 'react';
import './../style.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChatContext } from '../../../context/ChatContext';
import Select, { components } from 'react-select';
import getCurrencyByCountry from '../../../utils/getCurrencyService';
import Cookies from 'js-cookie';
import { ProductContext } from '../../../context/ProductContext';


const CustomOption = (props) => {
    const {countryCurrencySymbol} = useContext(ProductContext)
    return (
        <components.Option {...props}>
            <div className='select__video__item'>
                <img src={props.data.cover_image} alt="" />
                <div className="select__video__desc">
                    <h5>{props.data.label}</h5>
                    <h6>{props.data.price} {countryCurrencySymbol}</h6>
                </div>
            </div>
        </components.Option>
    );
};

function randomID(len) {
    let result = '';
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export default function NewStream() {
    const { USER_TOKKEN } = useContext(ChatContext)
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();
    const [thumberSrc, setthumberSrc] = useState('');
    const [myVideos, setMyVideos] = useState([]);
    const { countryCurrencySymbol } = useContext(ProductContext);
    const [selectedProduct, setSelectedProduct] = useState(false)

    const selectStyles = {
        control: (baseStyles) => ({
            ...baseStyles,
            background: 'var(--primaryColor)',
            borderRadius: '16px',
            textAlign: 'center',
            cursor: 'pointer',

            
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isSelected ? '#0384ca67' : isFocused ? 'var(--backgroundColor)' : 'none',
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
                zIndex: 9999
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!roomName && !thumberSrc) {
            toast.error('You missed the fields');
            return
        }
        if (!selectedProduct) {
            toast.error('You have not selected a product');
            return
        }

        if (roomName && thumberSrc) {
            let res = await axios.get('https://bivisibackend.store/api/user/user_detail/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(Cookies.get('authTokens')).access
                }
            })
            localStorage.setItem('avatar', res.data.avatar)
            localStorage.setItem('roomName', roomName)
            localStorage.setItem('isJoined', 'true')
            navigate(`/new-stream/${randomID(17)}`);
        } else if (!roomName) toast.error('You didn`t specify the name of the stream')
        else if (!thumberSrc) toast.error('You forgot to set the sketch for the stream')



    };

    const thumbernailOnChangeHandler = (e) => {
        let { files } = e.target;
        if (files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImageSrc = e.target.result;
                localStorage.setItem('streamThumb', newImageSrc);
                setthumberSrc(newImageSrc)
            };
            reader.readAsDataURL(files[0]);
        }
    };



    useEffect(() => {
        const getMyVideos = async () => {
            let res = await axios.get('https://bivisibackend.store/api/user_web_products', {
                headers: {
                    Authorization: `Bearer ${USER_TOKKEN}`
                }
            });

            let array = res.data.results.filter(item => item.product_type == 'Video')
            console.log(array);
            setMyVideos(array.map(item => {
                return {
                    value: item.id,
                    label: item.product.name,
                    price: item.product.price,
                    cover_image: item.cover_image
                }
            }));
        }

        getMyVideos();

    }, []);




    return (
        <div className="streams">
            <div className="stream__top__title">
                <h1>Create Stream</h1>
            </div>
            <form onSubmit={handleSubmit} className='stream__form'>

                <label>
                    <p>Stream Title</p>
                    <input
                        type="text"
                        placeholder="Stream Name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </label>

                <label >
                    <p>Select your video</p>
                    <Select
                        isSearchable={false}
                        styles={selectStyles}
                        options={myVideos}
                        placeholder='Select your video'
                      
                        onChange={(value) => {
                            
                            setSelectedProduct(true)
                            localStorage.setItem('streamSelectProductId', value.value)
                        }}
                        components={{ Option: CustomOption }}
                    />
                    {/* <Select.OptGroup>
                    {myVideos.map(item => {
                    return <Option key={item.id} value={item.id}>
                        
                    </Option>
                })}

                    </Select.OptGroup> */}



                </label>

                <div className="stream_thumbernail">
                    <input name='thumbernail' type="file" title=" " onChange={e => thumbernailOnChangeHandler(e)} className="thumbernail__input" />

                    {
                        thumberSrc ?
                            <img src={thumberSrc} alt="" className="thumbernail__image" />
                            :
                            <>
                                <svg width={130} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 10.25L6.96421 10.25C6.05997 10.25 5.33069 10.25 4.7424 10.3033C4.13605 10.3583 3.60625 10.4746 3.125 10.7524C2.55493 11.0815 2.08154 11.5549 1.7524 12.125C1.47455 12.6063 1.35826 13.1361 1.3033 13.7424C1.24998 14.3307 1.24999 15.06 1.25 15.9642L1.25 15.9642L1.25 16L1.25 16.0358L1.25 16.0358C1.24999 16.94 1.24998 17.6693 1.3033 18.2576C1.35826 18.8639 1.47455 19.3937 1.7524 19.875C2.08154 20.4451 2.55493 20.9185 3.125 21.2476C3.60625 21.5254 4.13605 21.6417 4.7424 21.6967C5.33067 21.75 6.05992 21.75 6.96412 21.75L6.96418 21.75L7 21.75L17 21.75L17.0357 21.75C17.94 21.75 18.6693 21.75 19.2576 21.6967C19.8639 21.6417 20.3937 21.5254 20.875 21.2476C21.4451 20.9185 21.9185 20.4451 22.2476 19.875C22.5254 19.3937 22.6417 18.8639 22.6967 18.2576C22.75 17.6693 22.75 16.94 22.75 16.0358L22.75 16L22.75 15.9642C22.75 15.06 22.75 14.3307 22.6967 13.7424C22.6417 13.1361 22.5254 12.6063 22.2476 12.125C21.9185 11.5549 21.4451 11.0815 20.875 10.7524C20.3937 10.4746 19.8639 10.3583 19.2576 10.3033C18.6693 10.25 17.94 10.25 17.0358 10.25L17 10.25L16 10.25C15.5858 10.25 15.25 10.5858 15.25 11C15.25 11.4142 15.5858 11.75 16 11.75L17 11.75C17.9484 11.75 18.6096 11.7507 19.1222 11.7972C19.6245 11.8427 19.9101 11.9274 20.125 12.0514C20.467 12.2489 20.7511 12.533 20.9486 12.875C21.0726 13.0899 21.1573 13.3755 21.2028 13.8778C21.2493 14.3904 21.25 15.0516 21.25 16C21.25 16.9484 21.2493 17.6096 21.2028 18.1222C21.1573 18.6245 21.0726 18.9101 20.9486 19.125C20.7511 19.467 20.467 19.7511 20.125 19.9486C19.9101 20.0726 19.6245 20.1573 19.1222 20.2028C18.6096 20.2493 17.9484 20.25 17 20.25L7 20.25C6.05158 20.25 5.39041 20.2493 4.87779 20.2028C4.37549 20.1573 4.0899 20.0726 3.875 19.9486C3.53296 19.7511 3.24892 19.467 3.05144 19.125C2.92737 18.9101 2.8427 18.6245 2.79718 18.1222C2.75072 17.6096 2.75 16.9484 2.75 16C2.75 15.0516 2.75072 14.3904 2.79718 13.8778C2.84271 13.3755 2.92737 13.0899 3.05144 12.875C3.24892 12.533 3.53296 12.2489 3.875 12.0514C4.0899 11.9274 4.37549 11.8427 4.87779 11.7972C5.39041 11.7507 6.05158 11.75 7 11.75L8 11.75C8.41421 11.75 8.75 11.4142 8.75 11C8.75 10.5858 8.41421 10.25 8 10.25L7 10.25ZM16.5303 6.46967L12.5303 2.46967C12.2374 2.17678 11.7626 2.17678 11.4697 2.46967L7.46967 6.46967C7.17678 6.76256 7.17678 7.23744 7.46967 7.53033C7.76256 7.82322 8.23744 7.82322 8.53033 7.53033L11.25 4.81066L11.25 16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16L12.75 4.81066L15.4697 7.53033C15.7626 7.82322 16.2374 7.82322 16.5303 7.53033C16.8232 7.23744 16.8232 6.76256 16.5303 6.46967Z" fill="currentColor"></path></svg>
                                <h4>
                                    upload a preview image for your stream
                                </h4>
                                <button type="button">Select Media</button>
                            </>
                    }


                </div>

                <button type="submit">Create My Stream</button>
            </form>

        </div>
    );
}
