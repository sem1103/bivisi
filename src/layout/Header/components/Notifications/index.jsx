import { useContext, useEffect} from "react"
import { NotificationContext } from "../../../../context/NotificationContext"
import './style.scss'
import { Link } from "react-router-dom";
import emptyAvatar from './../../../../assets/images/user-empty-avatar.png'
import { AuthContext } from "../../../../context/authContext";
import axios from "axios";
import Cookies from 'js-cookie'


const isReadHandler = async (ntfId) => {
    const USER_TOKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;
    const res2 = await axios.patch(`https://bivisibackend.store/api/notifications/${ntfId}`, {
        is_read: true
    }, {
        headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
        }
    });
}

const getNtfDate = (CreateDate) => {
    const dateObject = new Date(CreateDate);
    const currentDate = new Date();

    // Проверка, является ли дата из строки меньше текущей даты
    const isPast = dateObject < currentDate.setHours(0, 0, 0, 0);

    let formattedLocalTime = `${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}`;

    if (isPast) {
      const day = dateObject.getDate().toString().padStart(2, '0');
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
      const year = dateObject.getFullYear();
      return `${day}.${month} / ${formattedLocalTime}`
    }
    return formattedLocalTime
}




export default function Notifications({notifications, setNotifications}) {

    const { myVideos} = useContext(NotificationContext) 
    const {user} = useContext(AuthContext)


    
    const ntfLikeItem = (ntf,video, text) => {
    
    return (
        <div key={ntf.id} className={`ntf__item ${ntf.is_read ? 'is__read__ntf' : ''}`} onClick={() => {
            if(!ntf.is_read) {
                setNotifications(prev => {
                    return prev.map(notif => {
                        if(ntf.id == notif.id) {
                            return {
                                ...notif,
                                is_read: true
                            }
                        } else return notif
                    })
                })
                isReadHandler(ntf.id);
            }
        }}>
            <Link to={`/product_detail/${ntf.product_id}`}></Link>
            {
                !ntf.is_read && <hr className="ntf__is__read" />

            }
            <div className="user__avatar">
                <img src={ntf.sender.avatar ? ntf.sender.avatar : emptyAvatar} alt="User Avatar" />
            </div>
            <div className="ntf__text">
                <h3>
                {`${ntf.sender.first_name} ${text}`}     
                </h3>
                <p className="ntf__create">
                    {getNtfDate(ntf.created_at)}
                </p>
            </div>
            <div className="ntf__video">
                <img src={video.cover_image} alt={video.product.name} />
            </div>
        </div>
    )
}
    

    

    
    return (
        <div className="ntf_content">
            {
                notifications.map(ntf => {
                    if(ntf.notification_type == "Like" || ntf.notification_type == 'Comment'){
                        return myVideos?.map(video => {
                            if(video.id == ntf.product_id && ntf.message == `${ntf.sender.username} liked your product.`){
                                return  ntfLikeItem(ntf, video, 'liked your video!')
                            }else if(video.id == ntf.product_id && ntf.message == `${ntf.sender.username} liked your comment.` && user.username != ntf.sender.username){
                                return  ntfLikeItem(ntf, video, 'liked your comment!')
                            }else if(video.id == ntf.product_id && ntf.message == `${ntf.sender.username} commented on your product.` && user.username != ntf.sender.username){
                                return  ntfLikeItem(ntf, video, 'commented on your product...')
                            }else if(video.id == ntf.product_id && ntf.message == `${ntf.sender.username} replied to your comment.` && user.username != ntf.sender.username){
                                return  ntfLikeItem(ntf, video, 'replied to your comment...')
                            }
                            
                        })
                    } else if(ntf.notification_type == 'Subscribe'){
                        return <div key={ntf.id} className={`ntf__item subscribe__ntf__item ${ntf.is_read ? 'is__read__ntf' : ''}`} onClick={() => {
                            if(!ntf.is_read) {
                                setNotifications(prev => {
                                    return prev.map(notif => {
                                        if(ntf.id == notif.id) {
                                            return {
                                                ...notif,
                                                is_read: true
                                            }
                                        } else return notif
                                    })
                                })
                                isReadHandler(ntf.id);
                            }
                        }}>
                            {
                                !ntf.is_read && <hr className="ntf__is__read" />
                
                            }
                            <div className="user__avatar">
                                <img src={ntf.sender.avatar ? ntf.sender.avatar : emptyAvatar} alt="User Avatar" />
                            </div>
                            <div className="ntf__text ">
                                <h3>
                                {`${ntf.sender.first_name} has subscribed to your channel!`}     
                                </h3>
                                <p className="ntf__create">
                                    {getNtfDate(ntf.created_at)}
                                </p>
                            </div>
                           
                        </div>
                    }
                })
            }

           

            {/* <div className="empty__Nots">
                <svg width="138" height="132" viewBox="0 0 138 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M70.825 118.621C98.825 118.621 121.525 95.9215 121.525 67.8215C121.525 39.7215 98.725 17.0215 70.825 17.0215C42.825 17.0215 20.125 39.7215 20.125 67.8215C20.125 95.9215 42.825 118.621 70.825 118.621Z" fill="#2A2E37" />
                    <path d="M124.675 100.598C126.939 100.598 128.775 98.7628 128.775 96.4984C128.775 94.2341 126.939 92.3984 124.675 92.3984C122.411 92.3984 120.575 94.2341 120.575 96.4984C120.575 98.7628 122.411 100.598 124.675 100.598Z" fill="#2A2E37" />
                    <path d="M130.675 84.598C132.222 84.598 133.475 83.3444 133.475 81.798C133.475 80.2516 132.222 78.998 130.675 78.998C129.129 78.998 127.875 80.2516 127.875 81.798C127.875 83.3444 129.129 84.598 130.675 84.598Z" fill="#2A2E37" />
                    <path d="M22.825 34.4223C24.3714 34.4223 25.625 33.1687 25.625 31.6223C25.625 30.0759 24.3714 28.8223 22.825 28.8223C21.2786 28.8223 20.025 30.0759 20.025 31.6223C20.025 33.1687 21.2786 34.4223 22.825 34.4223Z" fill="#2A2E37" />
                    <path d="M5.72502 88.4215C8.5969 88.4215 10.925 86.0934 10.925 83.2215C10.925 80.3496 8.5969 78.0215 5.72502 78.0215C2.85314 78.0215 0.525024 80.3496 0.525024 83.2215C0.525024 86.0934 2.85314 88.4215 5.72502 88.4215Z" fill="#2A2E37" />
                    <path d="M77.1863 86.2383H65.9191C63.3085 86.2383 61.11 88.6466 61.11 91.5065V97.6778C61.11 104 65.7817 109.117 71.5527 109.117C77.3237 109.117 81.9955 104 81.9955 97.6778V91.5065C81.9955 88.4961 79.797 86.2383 77.1863 86.2383Z" fill="#5C6479" />
                    <g filter="url(#filter0_d_897_22840)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M76.1863 27.1039C87.211 29.654 95.4229 39.5274 95.4229 51.3265V54.4859C95.4229 81.1342 115.484 98.5793 115.484 98.5793H25.484C25.484 98.5793 45.6825 81.1342 45.6825 54.4859V51.3265C45.6825 39.5274 53.8945 29.654 64.9191 27.1039V26.0518C64.9191 22.8924 67.3924 20.4199 70.5527 20.4199C73.713 20.4199 76.1863 22.8924 76.1863 26.0518V27.1039Z" fill="url(#paint0_linear_897_22840)" />
                    </g>
                    <path d="M60.1099 65.3376C56.6748 65.3376 53.7893 63.1398 52.6901 59.9805C52.4153 59.2937 52.8275 58.6069 53.5145 58.3321C54.2015 58.0574 54.8886 58.4695 55.1634 59.1563C55.8504 61.2168 57.9115 62.7277 60.1099 62.7277C62.3084 62.7277 64.3695 61.3541 65.0565 59.1563C65.3313 58.4695 66.0183 58.0574 66.7053 58.3321C67.3924 58.6069 67.8046 59.2937 67.5298 59.9805C66.4305 63.2772 63.545 65.3376 60.1099 65.3376Z" fill="#9FA8BA" />
                    <path d="M80.858 65.3376C77.4229 65.3376 74.5374 63.1398 73.4381 59.9805C73.1633 59.2937 73.5755 58.6069 74.2626 58.3321C74.9496 58.0574 75.6366 58.4695 75.9114 59.1563C76.5984 61.2168 78.6595 62.7277 80.858 62.7277C83.0564 62.7277 85.1175 61.3541 85.8045 59.1563C86.0794 58.4695 86.7664 58.0574 87.4534 58.3321C88.1404 58.6069 88.5526 59.2937 88.2778 59.9805C87.1786 63.2772 84.2931 65.3376 80.858 65.3376Z" fill="#9FA8BA" />
                    <path d="M70.5528 82.1566C72.2981 82.1566 73.7131 80.7421 73.7131 78.9972C73.7131 77.2524 72.2981 75.8379 70.5528 75.8379C68.8074 75.8379 67.3925 77.2524 67.3925 78.9972C67.3925 80.7421 68.8074 82.1566 70.5528 82.1566Z" fill="#9FA8BA" />
                    <path d="M87.4869 4.64967V0H105.457V4.64967L93.1951 19.4441H105.668V24.0937H86.8527V19.4441L99.1146 4.64967H87.4869Z" fill="#9FA8BA" />
                    <path d="M102.286 39.5214V36.5625H113.914V39.5214L106.091 49.0321H114.125V51.991H101.863V49.0321L109.685 39.5214H102.286Z" fill="#9FA8BA" />
                    <defs>
                        <filter id="filter0_d_897_22840" x="3.48401" y="9.41992" width="134" height="122.16" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="11" />
                            <feGaussianBlur stdDeviation="11" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_897_22840" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_897_22840" result="shape" />
                        </filter>
                        <linearGradient id="paint0_linear_897_22840" x1="70.4547" y1="18.612" x2="70.4547" y2="99.4219" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#5C6479" />
                            <stop offset="0.9964" stop-color="#5C6479" />
                        </linearGradient>
                    </defs>
                </svg>
            </div> */}
        </div>
    )
}