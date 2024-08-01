import { useState, useEffect, useRef } from 'react';
import './style.scss';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import emptyAvatar from './../../assets/images/user-empty-avatar.png'
import liveStreemIcon from './../../layout/Sidebar/icons/live-streem.svg'
import getCurrencyByCountry from '../../utils/getCurrencyService';
import { Modal } from 'antd';


export default function LiveStreams() {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Destructure roomId from useParams
    const streamContainer = useRef(null); // Create a ref for the stream container
    const [isJoined, setIsJoined] = useState(false); // State to track if joined
    const [allStreams, setAllStreams] = useState([]);
    const [randomIndex, setRandomIndex] = useState(0);
    const { countryCurrencySymbol } = getCurrencyByCountry();
    const [showStream, setShowStream] = useState(roomId ? true : false)
    let zp = useRef(null);



    const handleSubmit = (id) => {
        setShowStream(true)
        setIsJoined(false); // Set the state to true after joining        
        navigate('/live-streams/' + id);
    };

    const joinStreamAsViewer = async (element) => {
        const appId = 1364666946;
        const serverSecret = '00e187d256dc675f3a9bedb57d81238f';
        const userId = Date.now().toString(); // Generate a unique user ID
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            serverSecret,
            roomId,
            userId,
            JSON.parse(localStorage.authTokens).username
        );

        zp.current = ZegoUIKitPrebuilt.create(kitToken);

        zp.current.joinRoom({
            showPreJoinView: false,
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                    role: ZegoUIKitPrebuilt.Audience,

                }
            },
            showLeaveRoomConfirmDialog: false,
            onLeaveRoom: () => {

                setShowStream(false)
                zp.current.destroy();
                navigate('/live-streams')
            }
            ,
            onUserAvatarSetter: (userList) => {
                if (localStorage.avatar != 'null') {
                    userList.forEach(user => {
                        user.setUserAvatar(localStorage.avatar)
                    })
                }

            }
        });

    };


    useEffect(() => {
        if (roomId != undefined && !isJoined) {
            joinStreamAsViewer(streamContainer.current);
            setIsJoined(true); // Set the state to true after joining
        }
        console.log(zp);
    }, [roomId]);


    useEffect(() => {
        const getStreams = async () => {
            try {
                let res = await axios.get('https://bivisibackend.store/api/core/stream/');
                setAllStreams(res.data)
                setRandomIndex(roomId == undefined ? Math.floor(Math.random() * res.data.length) : res.data.findIndex(item => item.room_id == roomId))
            } catch (error) {
                console.log(error);
            }
        }
        getStreams()

        return () => {
            if (isJoined && zp.current) {
                zp.current?.destroy();
                setIsJoined(false); // Reset the state
            }
        };
    }, [])



    return (
        <div className="streams">
            <div className="stream__top__title">
                <div className='d-flex align-items-center gap-2'>
                    <img width={27} src={liveStreemIcon} alt="" />
                    <h4 className='mt-1'>Live Videos</h4>
                </div>

                <NavLink to={'/new-stream'}>Create New Stream</NavLink>
            </div>

            <Modal
                onCancel={() => {
                    zp.current.destroy();
                    navigate('/live-streams')
                    setShowStream(false)
                }}
                className={'modal__body chat__modal stream__modal'}
                styles={{
                    mask: {
                        backdropFilter: 'blur(10px)',
                        zIndex: 999999999999,

                    }
                }}
                open={showStream}
            >
                <div className="active__stream" >
                    <div className="stream" ref={streamContainer} />

                    <div className="product__detail">
                        <div className="product__content">
                            <NavLink to={'/product_detail/' + allStreams[randomIndex]?.product_detail.id} onClick={() => zp.current?.destroy()} className={'product__link'} />
                            <div className="product__img">
                                <img src={allStreams[randomIndex]?.product_detail.cover_image} alt="" />
                            </div>
                            <h4>{allStreams[randomIndex]?.product_detail.name}</h4>
                            <h6>{allStreams[randomIndex]?.product_detail.price} {countryCurrencySymbol}</h6>
                        </div>
                    </div>


                    {
                        !roomId &&
                        <img src={allStreams[randomIndex]?.cover_image} alt="" className='cover__img' />
                    }
                    <div className="stream__info">
                        <div className="live__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3.95894 12.625C3.73961 12.4348 3.53346 12.2301 3.34189 12.0124C2.36936 10.8986 1.83398 9.474 1.83398 8C1.83398 6.52599 2.36936 5.10139 3.34189 3.98758C3.53346 3.76984 3.73961 3.56518 3.95894 3.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.59961 5.078C5.39764 5.2356 5.21535 5.41657 5.0566 5.61708C4.50217 6.28926 4.19922 7.13127 4.19922 8C4.19922 8.8688 4.50217 9.7108 5.0566 10.383C5.21535 10.5835 5.39764 10.7645 5.59961 10.9221" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.46954 8.00002C9.46341 8.26988 9.38227 8.53275 9.23507 8.75962C9.11174 8.95568 8.94501 9.12115 8.74761 9.24362C8.51741 9.38388 8.25254 9.45815 7.98241 9.45815C7.71234 9.45815 7.44747 9.38388 7.21727 9.24362C7.01981 9.12115 6.85314 8.95568 6.72981 8.75962C6.58849 8.53115 6.51367 8.26822 6.51367 8.00002C6.51367 7.73188 6.58849 7.46895 6.72981 7.24042C6.85314 7.04442 7.01981 6.87888 7.21727 6.75648C7.44747 6.6162 7.71234 6.54193 7.98241 6.54193C8.25254 6.54193 8.51741 6.6162 8.74761 6.75648C8.94501 6.87888 9.11174 7.04442 9.23507 7.24042C9.38227 7.46735 9.46341 7.73022 9.46954 8.00002Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.4004 10.9221C10.6024 10.7645 10.7847 10.5835 10.9434 10.383C11.4979 9.7108 11.8008 8.8688 11.8008 8C11.8008 7.13127 11.4979 6.28926 10.9434 5.61708C10.7847 5.41657 10.6024 5.2356 10.4004 5.078" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.041 3.375C12.2603 3.56518 12.4665 3.76984 12.658 3.98758C13.6305 5.10139 14.1659 6.52599 14.1659 8C14.1659 9.474 13.6305 10.8986 12.658 12.0124C12.4665 12.2301 12.2603 12.4348 12.041 12.625" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>
                                Live
                            </p>
                        </div>

                        <div className="stream__name">
                            {allStreams[randomIndex]?.room_name}
                        </div>

                        <div className="stream__host">
                            <img src={localStorage.avatar != null ? localStorage.avatar : emptyAvatar} alt="" className="user__img" />
                            <h4>
                                {allStreams[randomIndex]?.user_name}
                            </h4>
                        </div>


                    </div>



                    <div className={`stream__tools ${roomId ? 'hide__tools' : ''}`}>
                        <button className='play__stream' onClick={() => handleSubmit(allStreams[randomIndex]?.room_id)}>
                            <svg width="12" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="play">
                                    <path id="Vector 896" d="M8.62782 8.73644L2.99228 11.9568C1.65896 12.7186 0 11.7559 0 10.2203V6.99996V3.77965C0 2.24401 1.65896 1.28127 2.99228 2.04317L8.62782 5.26347C9.97145 6.03126 9.97145 7.96866 8.62782 8.73644Z" fill="white" />
                                </g>
                            </svg>

                        </button>

                        <button className='mute__stream'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.36591 6.26842L9.83268 3.66952C10.9314 2.84585 12.4993 3.62946 12.4993 5.00225V14.9977C12.4993 16.3705 10.9314 17.1541 9.83268 16.3304L6.36591 13.7315C6.01978 13.4721 5.59885 13.3318 5.16626 13.3318H3.33268C2.41221 13.3318 1.66602 12.5859 1.66602 11.6659V8.33407C1.66602 7.41401 2.41221 6.66816 3.33268 6.66816H5.16626C5.59885 6.66816 6.01978 6.5279 6.36591 6.26842ZM14.4987 5.30414C14.1604 5.23547 13.8305 5.45404 13.7619 5.79231C13.6932 6.13059 13.9118 6.46049 14.25 6.52916C15.8664 6.85725 17.0827 8.28726 17.0827 9.99996C17.0827 11.7127 15.8664 13.1427 14.25 13.4708C13.9118 13.5394 13.6932 13.8693 13.7619 14.2076C13.8305 14.5459 14.1604 14.7645 14.4987 14.6958C16.6861 14.2518 18.3327 12.3189 18.3327 9.99996C18.3327 7.68107 16.6861 5.74816 14.4987 5.30414ZM14.6873 8.01526C14.3885 7.84243 14.0062 7.94453 13.8334 8.24331C13.6605 8.5421 13.7626 8.92443 14.0614 9.09727C14.3744 9.27832 14.5827 9.61519 14.5827 9.99996C14.5827 10.3847 14.3744 10.7216 14.0614 10.9027C13.7626 11.0755 13.6605 11.4578 13.8334 11.7566C14.0062 12.0554 14.3885 12.1575 14.6873 11.9847C15.3707 11.5894 15.8327 10.849 15.8327 9.99996C15.8327 9.15094 15.3707 8.41056 14.6873 8.01526Z" fill="white" />
                            </svg>


                        </button>
                    </div>
                </div>
            </Modal>

            <div className="other__streams">
                {
                    allStreams.length ?
                        allStreams.map((item, ind) => {

                            return <div
                                onClick={() => {
                                    setRandomIndex(ind)
                                    handleSubmit(item.room_id)
                                }}
                                className="other__stream">
                                <img src={item.cover_image} alt="" className="cover__img" />

                                <div className="live__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3.95894 12.625C3.73961 12.4348 3.53346 12.2301 3.34189 12.0124C2.36936 10.8986 1.83398 9.474 1.83398 8C1.83398 6.52599 2.36936 5.10139 3.34189 3.98758C3.53346 3.76984 3.73961 3.56518 3.95894 3.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5.59961 5.078C5.39764 5.2356 5.21535 5.41657 5.0566 5.61708C4.50217 6.28926 4.19922 7.13127 4.19922 8C4.19922 8.8688 4.50217 9.7108 5.0566 10.383C5.21535 10.5835 5.39764 10.7645 5.59961 10.9221" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9.46954 8.00002C9.46341 8.26988 9.38227 8.53275 9.23507 8.75962C9.11174 8.95568 8.94501 9.12115 8.74761 9.24362C8.51741 9.38388 8.25254 9.45815 7.98241 9.45815C7.71234 9.45815 7.44747 9.38388 7.21727 9.24362C7.01981 9.12115 6.85314 8.95568 6.72981 8.75962C6.58849 8.53115 6.51367 8.26822 6.51367 8.00002C6.51367 7.73188 6.58849 7.46895 6.72981 7.24042C6.85314 7.04442 7.01981 6.87888 7.21727 6.75648C7.44747 6.6162 7.71234 6.54193 7.98241 6.54193C8.25254 6.54193 8.51741 6.6162 8.74761 6.75648C8.94501 6.87888 9.11174 7.04442 9.23507 7.24042C9.38227 7.46735 9.46341 7.73022 9.46954 8.00002Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10.4004 10.9221C10.6024 10.7645 10.7847 10.5835 10.9434 10.383C11.4979 9.7108 11.8008 8.8688 11.8008 8C11.8008 7.13127 11.4979 6.28926 10.9434 5.61708C10.7847 5.41657 10.6024 5.2356 10.4004 5.078" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12.041 3.375C12.2603 3.56518 12.4665 3.76984 12.658 3.98758C13.6305 5.10139 14.1659 6.52599 14.1659 8C14.1659 9.474 13.6305 10.8986 12.658 12.0124C12.4665 12.2301 12.2603 12.4348 12.041 12.625" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p>
                                        Live
                                    </p>
                                </div>

                                <div className="stream__desc">
                                    <h5 className="stream__name">
                                        {item.room_name}
                                    </h5>

                                    <div className="user__info">
                                        <img src={item.cover_image} alt="" className="user__avatar" />

                                        <h6>{item.user_name}</h6>
                                    </div>
                                </div>
                            </div>


                        })
                        :
                        <div className='empty__stream'>
                            <h4>there are no active streams</h4>
                        </div>
                }
            </div>
        </div>
    );
}
