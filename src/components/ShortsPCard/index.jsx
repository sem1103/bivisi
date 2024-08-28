import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import bag from "../../assets/icons/Bag-3.svg";
import { handleAddToBasket } from "../../helpers";
import { useCart } from "react-use-cart";
import shortsp_img from "../../assets/images/shorts-page-card.png";
import like from "../../assets/icons/like-light.svg";
import chat from "../../assets/icons/chat-ligth.svg";
import { FaChevronDown } from "react-icons/fa6";
import ReactPlayer from "react-player";
import useAxios from "../../utils/useAxios";
import { ProductContext } from "../../context/ProductContext";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { toggleLike } from "../../helpers/index";
import WishBtn from "../WishlistBtn";
import delete_img from "../../assets/icons/delete.svg";
import edit from "../../assets/icons/edit.svg";
import close from "../../assets/icons/close.svg";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import replay from "../../assets/icons/replay-rectangle.png";
import { Modal } from "antd";
import ShareModal from "../ShareModal";
import getCurrencyByCountry from "../../utils/getCurrencyService";
import { CModal, CModalHeader, CModalTitle, CModalFooter, CButton } from "@coreui/react";
import { GoogleMap, Marker } from '@react-google-maps/api';
import axios from "axios";
import { BASE_URL } from "../../api/baseUrl";
import useSubscription from "../../hooks/useSubscription";
import empryAvatar from './../../assets/images/user-empty-avatar.png'
import { NavLink } from "react-router-dom";


const ShortsPCrd = ({ handleEnter, handleLeave, productItemShort, isPlaying, setPlaying }) => {
  const axiosInstance = useAxios();

  const {
    isSubscribed,
    followersCount,
    handleSubscribe,
    handleUnsubscribe,
    searchUser,
    fetchSubscribers,
    checkSubscribed
  } = useSubscription(productItemShort.user.name)

  const { product, setProduct, isLoaded } = useContext(ProductContext);
  const { user, userDetails } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [category, setCategory] = useState([])

  const { addItem } = useCart();
  const [showSubCommentId, setShowSubCommentId] = useState(null);
  const playerRef = useRef(null);
  const menuRef = useRef(null);

  const { countryCurrencySymbol } = getCurrencyByCountry()
  useEffect(() => {
    if (user && productItemShort.is_liked) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, productItemShort.is_liked]);


  useEffect(() => {
    if (
      !isPlaying &&
      playerRef.current &&
      playerRef.current.getInternalPlayer()
    ) {
      // playerRef.current.seekTo(0);
      playerRef.current.getInternalPlayer().pause();

    }
  }, [isPlaying]);



  useEffect(() => {
    if (productItemShort && productItemShort.id) {
      fetchParentComments();
    }
  }, [productItemShort]);

  useEffect(() => {
    handleSearch(productItemShort.location);
    fetchCategoriesData()
  }, []);

  const [comments, setComments] = useState([]);
  const [user_comment, setUser_comment] = useState("");
  const [user_reply, setUserReply] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [openMenu, setOpenMenu] = useState({});
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deleteIsSubComment, setDeleteIsSubComment] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailModal, setDetailModal] = useState(false);

  const TOKEN = 'pk.eyJ1Ijoic2VtMTEwMyIsImEiOiJjbHhyemNmYTIxY2l2MmlzaGpjMjlyM3BsIn0.CziZDkWQkfqlxfqiKWW3IA';


  const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 })


  const fetchParentComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/parent_comments/${productItemShort.id}/`
      );
      const parentComments = response.data.results;
      const subCommentsPromises = parentComments.map((comment) =>
        axiosInstance.get(`/sub_comments/${comment.id}/`)
      );
      const subCommentsResponses = await Promise.all(subCommentsPromises);

      const commentsWithSubComments = parentComments.map((comment, index) => ({
        ...comment,
        sub_comments: subCommentsResponses[index].data.results,
      }));

      setComments(commentsWithSubComments);

    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSearch = async (searchText) => {

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: searchText,
          key: 'AIzaSyDSalM865lZHc8e3B7a0KWSCJKzGm7m37Q',
        },
      });

      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;

        setCenter({
          lat,
          lng,
        });
      }
    } catch (error) {
      console.error('Ошибка при геокодировании:', error);
    }
  };

  const handlePostComment = async (comment) => {
    if (!comment) {
      toast.warning("Please write your comment");
      return;
    } else if (!user) {
      toast.warning("Please sign in");
      return;
    }
    const payload = {
      user: user.user_id,
      product: productItemShort.id,
      comment: comment,
      parent_comment: replyToCommentId,
    };
    try {
      const res = await axiosInstance.post(`/product_comment/`, payload);
      console.log("Payload:", payload);
      console.log("Response:", res.data);
      if (res.status === 201) {
        setUser_comment("");
        setReplyToCommentId(null);
        toast.success("Your comment successfully posted!");
        fetchParentComments();
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      const res = await axiosInstance.delete(
        `/delete_comment/${deleteCommentId}/`
      );
      if (res.status === 204) {
        toast.success("Your comment successfully deleted!");
        setComments((prevComments) => {
          if (deleteIsSubComment) {
            return prevComments.map((parentComment) => ({
              ...parentComment,
              sub_comments: parentComment.sub_comments.filter(
                (subComment) => subComment.id !== deleteCommentId
              ),
            }));
          } else {
            return prevComments.filter(
              (comment) => comment.id !== deleteCommentId
            );
          }
        });
        setIsModalVisible(false);
        setDeleteCommentId(null);
        setDeleteIsSubComment(false);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleCommentLike = async (id, isSubComment) => {
    if (!user) {
      toast.warning("Please log in");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/toggle_product_comment_like/${id}/`
      );

      const response = await axiosInstance.get(`/product_comment/${id}/`);
      console.log("Response:", res.data);
      if (res.data.message === "Product comment liked") {
        toast.success("You liked the comment successfully!");
      } else {
        toast.error("You unliked the comment successfully!");
      }
      const updatedComment = response.data;

      // If it's a sub-comment, find and update the like count of that sub-comment
      if (isSubComment) {
        setComments((prevComments) =>
          prevComments.map((parentComment) => ({
            ...parentComment,
            sub_comments: parentComment.sub_comments.map((subComment) => {
              if (subComment.id === id) {
                return {
                  ...subComment,
                  like_count: updatedComment.like_count,
                };
              }
              return subComment;
            }),
          }))
        );
      } else {
        // Otherwise, update the like count of the parent comment
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === id) {
              return {
                ...comment,
                like_count: updatedComment.like_count,
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  const handleMenuToggle = (commentId) => {
    setOpenMenu((prevMenuId) => (prevMenuId === commentId ? null : commentId));
  };

  const handleReplyToggle = (commentId) => {
    setReplyToCommentId((prevId) => (prevId === commentId ? null : commentId));
    setUser_comment("");
    setUserReply('')
  };

  const handlePlay = () => {
    setPlaying(productItemShort.id);

  };

  const showModal = (commentId, isSubComment) => {
    setIsModalVisible(true);
    setDeleteCommentId(commentId);
    setDeleteIsSubComment(isSubComment);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setDeleteCommentId(null);
    setDeleteIsSubComment(false);
  };

  const toggleSubComment = (commentId) => {
    setShowSubCommentId((prevId) => (prevId === commentId ? null : commentId));
  };

  const avatarImage =
    userDetails?.avatar ||
    "https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg";


  const fetchCategoriesData = async () => {
    try {
      const categoryRes = await axios.get(
        `${BASE_URL}/categories/`
      );
      setCategory(categoryRes.data.results);


    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>

      <CModal
        onClose={handleCancel}
        alignment="center"
        className='modal-delete'
        visible={isModalVisible}

      >
        <button
          className="close__modal stroke__change"
          onClick={() => {
            handleCancel()
          }}
        >
          <svg width={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
        </button>

        <CModalTitle id="VerticallyCenteredExample">Delete Comment</CModalTitle>

        <p>Are you sure you want to delete this comment?</p>

        <CModalFooter>
          <CButton color="secondary" onClick={() => handleCancel()}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleDeleteComment}>Save changes</CButton>
        </CModalFooter>
      </CModal>


      <div className="col-lg-12 col-md-12 col-sm-12 col-12 pb-3 mb-4 d-flex justify-content-center align-items-center">
        <div className="shorts_page_card">
          <div className={`wrapper ${openComment ? "comment-open" : ""}`}>

            <div className={`main ${openComment ? "comment-open" : ""}`} >

              <div
                onClick={() => {
                  !isPlaying ? playerRef.current.getInternalPlayer().play() : playerRef.current.getInternalPlayer().pause();
                  isPlaying = !isPlaying;


                }}
              >
                <ReactPlayer

                  ref={playerRef}
                  className="video"
                  controls={false}
                  url={productItemShort?.product_video_type[0]?.original_video}

                  style={{ objectFit: "cover" }}
                  playing={isPlaying}
                  onPlay={handlePlay}
                  loop={true}
                />
              </div>


              <div className="sp_desc">
                <CModal

                  alignment="center"
                  visible={detailModal}
                  onClose={() => {
                    setDetailModal(false)

                  }}

                >

                  <button
                    className="close__modal stroke__change"
                    onClick={() => {
                      setDetailModal(false)
                    }}
                  >
                    <svg width={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                  </button>


                  <div className="short__info">
                    <h3>{productItemShort.name}</h3>
                    <h4>{productItemShort.description}</h4>

                    <br />
                    <div className="user__block">
                      <div className="left__block">
                        <div className="user__avatar">
                          <img src={productItemShort.user.avatar ? productItemShort.user.avatar : empryAvatar} alt="" />
                        </div>
                        <div className="user__desc">
                          <NavLink to={`/channels_detail/channels_videos/${productItemShort.user.name}`} />
                          <h2 className="user__name">
                            {productItemShort.user.name}
                          </h2>
                          {
                            user &&
                            <p>
                              {followersCount} subscribers
                            </p>
                          }

                        </div>
                      </div>

                      {/* <div className="right__block">
                        {
                          productItemShort.user.name != user?.username && user &&
                          <div className="subs_btn">
                            <button
                              onClick={() => {
                                isSubscribed ? handleUnsubscribe() : handleSubscribe()
                              }}
                              className={`subs-button ${isSubscribed ? 'unsubs-button' : ''}`}>{!isSubscribed ? <span>Subscribe</span> : <span>Unsubscribe</span>}</button>
                          </div>
                        }

                      </div> */}
                    </div>


                    <div className="video__properties">
                      <h4>Categories</h4>
                      <table style={{ borderCollapse: 'collapse', width: '100%', background: 'var(--backgroundColor)', margin: ' 0 0 20px 0' }}>
                        <tbody>
                          {

                            category.map(item => {
                              if (item.id == productItemShort.category[0]) {
                                return <tr >
                                  <td style={{ fontWeight: '600' }}>{item.name}</td>
                                  <td >{item.children.map(sub => sub.id == productItemShort.category[1] && sub.name)}</td>
                                </tr>
                              }
                            })



                          }
                        </tbody>
                      </table>
                    </div>

                    {productItemShort.properties.length > 0 &&
                      <div className="video__properties">
                        <h5>Properties</h5>
                        <table style={{ borderCollapse: 'collapse', width: '100%', background: 'var(--backgroundColor)', margin: ' 0 0 20px 0' }}>
                          <tbody>
                            {

                              productItemShort.properties.map((item) => (
                                <tr key={item.id}>
                                  <td style={{ fontWeight: '600' }}>{item.product_property}</td>
                                  <td >{item.property_value}</td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    }


                    <div className="video__address">
                      <h4>Address</h4>
                      <p><a href={productItemShort.location_url} target="_blank">
                        {productItemShort.location}
                      </a></p>
                      <div className="address__map">
                        {isLoaded && (
                          <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px' }}

                            center={center}
                            zoom={15}

                            options={{
                              disableDefaultUI: true, // Отключить стандартный интерфейс
                              gestureHandling: 'greedy', // Управление жестами
                              zoomControl: true, // Включить управление зумом
                            }}
                          >
                            <Marker position={center} />
                          </GoogleMap>
                        )}
                      </div>
                    </div>
                  </div>
                </CModal>

                <div className="short__inform">
                  <p >{productItemShort.name.slice(0, 20)}... <button onClick={() => {
                    checkSubscribed()

                    setDetailModal(true)
                  }}>Read more</button></p>
                  <span>{productItemShort.price + countryCurrencySymbol}</span>
                </div>
              </div>
            </div>
            <div className={`shorts_page_content ${openComment ? "hide__buttons" : ""}`}>
              <div
                className={`shorts_page_left `}
              >
                <div className=" pb-3">
                  <div className="icons stroke__change">
                    {/* <img
                      src={bag}
                      alt=""
                      
                    /> */}

                    <button
                      onClick={() => {
                        if (user.user_id === productItemShort.user.id) {
                          toast.warning(
                            "You cannot add your own product to the basket"
                          );
                        } else {
                          handleAddToBasket(productItemShort, user, axiosInstance);
                          addItem(productItemShort);
                        }
                      }}
                    >
                      <svg width="25" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="Icon/Bag 3">
                          <path id="Rectangle 794" d="M13.3332 5.00008C13.3332 3.15913 11.8408 1.66675 9.99984 1.66675C8.15889 1.66675 6.6665 3.15913 6.6665 5.00008" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path id="Rectangle 788" d="M3.80146 7.91988C4.00997 6.25179 5.42797 5 7.10905 5H12.8905C14.5716 5 15.9896 6.25179 16.1981 7.91988L17.0314 14.5866C17.2801 16.5761 15.7288 18.3333 13.7238 18.3333H6.27572C4.27073 18.3333 2.71944 16.5761 2.96813 14.5866L3.80146 7.91988Z" stroke="var(--textColor)" stroke-width="1.5" stroke-linejoin="round" />
                          <path id="Vector 1788" d="M7.5 13.3333C9.46345 14.4502 10.5396 14.4385 12.5 13.3333" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                      </svg>

                    </button>
                  </div>
                </div>
                <div className=" pb-3">
                  <div className="icons stroke__change">
                    <WishBtn ProductItemVideoCard={productItemShort} />
                  </div>
                  {/* <span>46 </span> */}
                </div>
                <div className=" pb-3">
                  <div className="icons fill__change">
                    <ShareModal item={productItemShort} />
                  </div>
                  {/* <span>14</span> */}
                </div>
                <div className=" pb-3">
                  <div
                    className={`icons ${animate ? "animated" : ""} fill__change`}
                    onClick={() =>
                      toggleLike(
                        productItemShort.id,
                        axiosInstance,
                        setLiked,
                        setProduct,
                        user
                      )
                    }
                    style={{ background: liked ? "#0385ca" : "none" }}
                  >
                    {/* <img src={like} alt="" /> */}

                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="like">
                        <path id="combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M9.78888 18H6.12309C4.28761 18 2.68768 16.7508 2.24252 14.9701L0.621247 8.48507C0.305674 7.22278 1.26039 6 2.56153 6H7.99998L6.59115 3.88675C5.48355 2.22536 6.67453 0 8.67127 0H9.99998L13.8682 6.76943C13.9546 6.92052 14 7.09154 14 7.26556V15.4648C14 15.7992 13.8329 16.1114 13.5547 16.2969L12.0077 17.3282C11.3506 17.7662 10.5786 18 9.78888 18ZM18 5H17.5C16.3954 5 15.5 5.89543 15.5 7V16C15.5 17.1046 16.3954 18 17.5 18H18C19.1045 18 20 17.1046 20 16V7C20 5.89543 19.1045 5 18 5Z" fill="var(--textColor)" />
                      </g>
                    </svg>

                  </div>
                  <span>{productItemShort.like_count}</span>
                </div>


                <div className=" pb-3">
                  <div
                    className="icons fill__change"
                    onClick={() => setOpenComment(!openComment)}
                  >
                    {/* <img src={chat} alt="" /> */}

                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="chat">
                        <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M9 0H11C15.9706 0 20 4.02944 20 9C20 13.9706 15.9706 18 11 18H4C1.79086 18 0 16.2091 0 14V9C0 4.02944 4.02944 0 9 0ZM6 11.75C5.58579 11.75 5.25 11.4142 5.25 11C5.25 10.5858 5.58579 10.25 6 10.25H10C10.4142 10.25 10.75 10.5858 10.75 11C10.75 11.4142 10.4142 11.75 10 11.75H6ZM6 7.75C5.58579 7.75 5.25 7.41421 5.25 7C5.25 6.58579 5.58579 6.25 6 6.25H14C14.4142 6.25 14.75 6.58579 14.75 7C14.75 7.41421 14.4142 7.75 14 7.75H6Z" fill="var(--textColor)" />
                      </g>
                    </svg>

                  </div>
                  <span>{comments?.length}</span>
                </div>
                <div className=" pb-3">
                  <div className="icons fill__change">
                    {/* <img src={eye} alt="" /> */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="Icon/Eye/Solid">
                        <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M17.6084 11.7892C18.5748 10.7724 18.5748 9.22772 17.6084 8.211C15.9786 6.49619 13.1794 4.16675 9.99984 4.16675C6.82024 4.16675 4.02108 6.49619 2.39126 8.211C1.42492 9.22772 1.42492 10.7724 2.39126 11.7892C4.02108 13.504 6.82024 15.8334 9.99984 15.8334C13.1794 15.8334 15.9786 13.504 17.6084 11.7892ZM9.99984 12.5001C11.3805 12.5001 12.4998 11.3808 12.4998 10.0001C12.4998 8.61937 11.3805 7.50008 9.99984 7.50008C8.61913 7.50008 7.49984 8.61937 7.49984 10.0001C7.49984 11.3808 8.61913 12.5001 9.99984 12.5001Z" fill="var(--textColor)" />
                      </g>
                    </svg>

                  </div>
                  <span>{productItemShort.view_count
                  }</span>
                </div>
              </div>
              <div onTouchStart={handleEnter} onTouchEnd={handleLeave} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={`shorts_comment ${openComment ? "open" : ""}`}>
                {openComment && (
                  <div className="comment_content">
                    <div className="comment_head">
                      <div className="d-flex justify-content-between align-items-center c_heading">
                        <h5>Comments</h5>
                        <div>
                          {/* <img
                            src={close}
                           
                            alt=""
                          /> */}

                          <button
                            className="close_btn"
                            onClick={() => {
                              setOpenComment(!openComment);
                              handleLeave()
                            }}
                          >
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g id="Icon/Remove">
                                <path id="Vector" d="M18.9498 9.05029L9.05029 18.9498M18.9498 18.9497L9.05029 9.05023" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </g>
                            </svg>

                          </button>
                        </div>
                      </div>

                      <div className="comments_heading  mt-3">
                        {comments?.map((comment, _i) => {
                          return (
                            <div className="d-flex gap-3 comments_list mt-3" key={_i}>
                              <div className="comment_avatar">
                                <img src={comment?.user?.avatar ?? avatarImage} alt="" />
                              </div>
                              <div className="comment_content_right">
                                <h6 className="comment_user">
                                  {comment.user?.name}
                                </h6>
                                <p className="comments">{comment?.comment}</p>

                                <div className="mt-3 d-flex gap-3 comment_footer">
                                  <div className="d-flex align-items-center gap-3">
                                    <button
                                      className="like_btn"
                                      onClick={() =>
                                        toggleCommentLike(comment.id)
                                      }
                                    >
                                      {/* <img src={like} alt="like.svg" /> */}
                                      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="like">
                                          <path id="combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M9.78888 18H6.12309C4.28761 18 2.68768 16.7508 2.24252 14.9701L0.621247 8.48507C0.305674 7.22278 1.26039 6 2.56153 6H7.99998L6.59115 3.88675C5.48355 2.22536 6.67453 0 8.67127 0H9.99998L13.8682 6.76943C13.9546 6.92052 14 7.09154 14 7.26556V15.4648C14 15.7992 13.8329 16.1114 13.5547 16.2969L12.0077 17.3282C11.3506 17.7662 10.5786 18 9.78888 18ZM18 5H17.5C16.3954 5 15.5 5.89543 15.5 7V16C15.5 17.1046 16.3954 18 17.5 18H18C19.1045 18 20 17.1046 20 16V7C20 5.89543 19.1045 5 18 5Z" fill="var(--textColor)" />
                                        </g>
                                      </svg>
                                    </button>
                                    <span>{comment.like_count}</span>
                                  </div>

                                  <div className="d-flex align-items-center gap-3">
                                    <button
                                      className="replay_btn"
                                      onClick={() =>
                                        handleReplyToggle(comment.id)
                                      }
                                    >
                                      {/* <img src={replay} alt="like.svg" /> */}

                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.00002 0.666626C2.15907 0.666626 0.666687 2.15901 0.666687 3.99996V14C0.666687 15.8409 2.15907 17.3333 4.00002 17.3333H14C15.841 17.3333 17.3334 15.8409 17.3334 14V3.99996C17.3334 2.15901 15.841 0.666626 14 0.666626H4.00002ZM7.82 5.14666C8.1072 4.95519 8.49525 5.0328 8.68672 5.32C8.87819 5.60721 8.80058 5.99525 8.51337 6.18672L7.49126 6.86813C8.62083 7.06979 9.69827 7.46437 10.5967 8.06333C11.9908 8.99269 12.9584 10.4243 12.9584 12.3334C12.9584 12.6785 12.6785 12.9584 12.3334 12.9584C11.9882 12.9584 11.7084 12.6785 11.7084 12.3334C11.7084 10.9091 11.0093 9.84069 9.90333 9.10339C9.0731 8.5499 8.01734 8.18954 6.88817 8.03884L7.85339 9.48667C8.04486 9.77388 7.96725 10.1619 7.68004 10.3534C7.39284 10.5449 7.00479 10.4673 6.81332 10.18L5.14666 7.68005C4.95519 7.39284 5.03279 7.0048 5.32 6.81333L7.82 5.14666Z" fill="var(--textColor)" />
                                      </svg>
                                    </button>
                                  </div>

                                  {comment.user.id === user.user_id && (
                                    <div
                                      className="d-flex align-items-center gap-3"
                                      ref={menuRef}
                                    >
                                      <button
                                        className="dot_btn"
                                        onClick={() =>
                                          handleMenuToggle(comment.id)
                                        }
                                      >
                                        <HiOutlineDotsHorizontal />
                                      </button>
                                      {openMenu === comment.id && (
                                        <div className="drop_menu">
                                          <button
                                            onClick={() => {
                                              console.log(isModalVisible);

                                              showModal(comment.id, false);
                                            }}
                                          >
                                            <svg style={{ opacity: 0.7 }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g id="Icon/Trash/Outline">
                                                <path id="Vector" d="M15.8333 7.49935L15.2367 15.255C15.1032 16.9917 13.655 18.3327 11.9132 18.3327H8.08677C6.34498 18.3327 4.89684 16.9917 4.76326 15.255L4.16667 7.49935M17.5 5.83268C15.3351 4.77766 12.7614 4.16602 10 4.16602C7.23862 4.16602 4.66493 4.77766 2.5 5.83268M8.33333 4.16602V3.33268C8.33333 2.41221 9.07953 1.66602 10 1.66602C10.9205 1.66602 11.6667 2.41221 11.6667 3.33268V4.16602M8.33333 9.16602V14.166M11.6667 9.16602V14.166" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" />
                                              </g>
                                            </svg>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <form
                                  className={`reply-form ${replyToCommentId === comment.id
                                    ? "active"
                                    : ""
                                    }`}
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handlePostComment(user_reply);
                                  }}
                                >
                                  <div className="avatar ">
                                    <img src={comment?.user?.avatar ?? avatarImage} alt="" />
                                  </div>
                                  <div className="d-flex flex-column align-items-start justify-content-cneter">
                                    <div className="reply-username">{user.username}</div>
                                    <input
                                      type="text"
                                      value={user_reply}
                                      data-userComment='true'
                                      placeholder="Write your reply...."
                                      onChange={(e) =>
                                        setUserReply(e.target.value)
                                      }
                                    />
                                  </div>

                                  <button type="submit">Publish</button>
                                </form>
                                {comment.sub_comments.length > 0 && (
                                  <button className={`reply-btn ${showSubCommentId === comment.id && "active"} `} onClick={() => toggleSubComment(comment.id)}>
                                    <FaChevronDown /> {comment.sub_comments.length} reply
                                  </button>
                                )}
                                {comment.sub_comments && showSubCommentId === comment.id &&
                                  comment.sub_comments.length > 0 && (
                                    <div className="sub-comments">
                                      {comment.sub_comments.map(
                                        (subComment) => (
                                          <div
                                            key={subComment.id}
                                            className="sub-comment"
                                          >
                                            <div className="d-flex gap-3 mt-1">
                                              <div className="comment_avatar">
                                                <p className="mb-0">
                                                  <img
                                                    src={subComment?.user?.avatar || avatarImage}
                                                    alt=""
                                                  />
                                                </p>
                                              </div>
                                              <div>
                                                <h5 className="comment_user">
                                                  {subComment.user.name}
                                                </h5>
                                                <p className="mb-0 comment">
                                                  {subComment.comment}
                                                </p>
                                                <div className="mt-1 d-flex gap-3 comment_footer">
                                                  <div className="d-flex align-items-center gap-3">
                                                    <button
                                                      className="like-btn"
                                                      onClick={() =>
                                                        toggleCommentLike(
                                                          subComment.id,
                                                          true
                                                        )
                                                      }
                                                    >
                                                      {/* <img
                                                        src={like}
                                                        alt="like.svg"
                                                      /> */}

                                                      <svg style={{ opacity: 0.6 }} width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g id="like">
                                                          <path id="combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M9.78888 18H6.12309C4.28761 18 2.68768 16.7508 2.24252 14.9701L0.621247 8.48507C0.305674 7.22278 1.26039 6 2.56153 6H7.99998L6.59115 3.88675C5.48355 2.22536 6.67453 0 8.67127 0H9.99998L13.8682 6.76943C13.9546 6.92052 14 7.09154 14 7.26556V15.4648C14 15.7992 13.8329 16.1114 13.5547 16.2969L12.0077 17.3282C11.3506 17.7662 10.5786 18 9.78888 18ZM18 5H17.5C16.3954 5 15.5 5.89543 15.5 7V16C15.5 17.1046 16.3954 18 17.5 18H18C19.1045 18 20 17.1046 20 16V7C20 5.89543 19.1045 5 18 5Z" fill="var(--textColor)" />
                                                        </g>
                                                      </svg>

                                                    </button>
                                                    <span>
                                                      {subComment.like_count}
                                                    </span>
                                                  </div>
                                                  {subComment.user.id ===
                                                    user.user_id && (
                                                      <div
                                                        className="d-flex align-items-center gap-3"
                                                        ref={menuRef}
                                                      >
                                                        <button
                                                          className="dot_btn"
                                                          onClick={() =>
                                                            handleMenuToggle(
                                                              subComment.id
                                                            )
                                                          }
                                                        >
                                                          <HiOutlineDotsHorizontal />
                                                        </button>
                                                        {openMenu ===
                                                          subComment.id && (
                                                            <div className="drop_menu">
                                                              <button
                                                                onClick={() => {

                                                                  showModal(
                                                                    subComment.id,
                                                                    true
                                                                  );
                                                                }}
                                                              >
                                                                <svg style={{ opacity: 0.7 }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                  <g id="Icon/Trash/Outline">
                                                                    <path id="Vector" d="M15.8333 7.49935L15.2367 15.255C15.1032 16.9917 13.655 18.3327 11.9132 18.3327H8.08677C6.34498 18.3327 4.89684 16.9917 4.76326 15.255L4.16667 7.49935M17.5 5.83268C15.3351 4.77766 12.7614 4.16602 10 4.16602C7.23862 4.16602 4.66493 4.77766 2.5 5.83268M8.33333 4.16602V3.33268C8.33333 2.41221 9.07953 1.66602 10 1.66602C10.9205 1.66602 11.6667 2.41221 11.6667 3.33268V4.16602M8.33333 9.16602V14.166M11.6667 9.16602V14.166" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" />
                                                                  </g>
                                                                </svg>

                                                              </button>
                                                            </div>
                                                          )}
                                                      </div>
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <form
                      className="comment_write"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handlePostComment(user_comment);
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div className="avatar ">
                          <img src={avatarImage} alt="" />
                        </div>
                        <div>
                          <h6 className="text-start cw_username">
                            {userDetails?.username}
                          </h6>
                          <input
                            type="text"
                            value={user_comment}
                            placeholder="Write your comment...."
                            onChange={(e) => setUser_comment(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4 d-flex justify-content-end">
                        <button type="submit">Publish</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShortsPCrd;
