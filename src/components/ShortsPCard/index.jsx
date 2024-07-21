import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import bag from "../../assets/icons/Bag-3.svg";
import { handleAddToBasket } from "../../helpers";
import { useCart } from "react-use-cart";
import Map, { Marker } from 'react-map-gl';
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
import eye from "../../assets/icons/eye.svg";
const ShortsPCrd = ({ handleEnter, handleLeave, productItemShort, isPlaying, setPlaying }) => {
  const axiosInstance = useAxios();
  const { product, setProduct } = useContext(ProductContext);
  const { user, userDetails } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const { addItem } = useCart();
  const [showSubCommentId, setShowSubCommentId] = useState(null);
  const playerRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
    if (user && productItemShort.is_liked) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, productItemShort.is_liked]);


  console.log(productItemShort);
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
    handleSearch(productItemShort.location) 
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

  
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 13
  });

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

  const handleSearch = (searchText) =>  {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const { center, place_name } = data.features[0];
          setUserLocation(prev => {
            return {
              latitude: center[1],
              longitude: center[0],
              zoom: 13
            }
          });

          setShowMap(true)
        }
      })
      .catch(error => console.error('Error fetching coordinates:', error));
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
    setDeleteCommentId(commentId);
    setDeleteIsSubComment(isSubComment);
    setIsModalVisible(true);
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

  return (
    <>
      {" "}
      <Modal
        title="Delete Comment"
        visible={isModalVisible}
        onOk={handleDeleteComment}
        onCancel={handleCancel}
        centered
        className="modal-delete"
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>


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
                <Modal
                  className={'modal__body chat__modal'}

                  open={detailModal}
                  onCancel={() => setDetailModal(false)}
                  styles={{
                    mask: {
                      backdropFilter: 'blur(10px)',
                      zIndex: 999999999999,
                    }
                  }}
                >
                  <div className="short__info">
                    <h3>{productItemShort.name}</h3>
                    <h4>{productItemShort.description}</h4>

                    <div className="video__properties">
                      <h5>Properties</h5>
                      <table style={{ borderCollapse: 'collapse', width: '100%', background: '#252525', margin: ' 0 0 20px 0' }}>
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

                    <div className="video__address">
                      <h4>Address</h4>
                      <p><a href={productItemShort.location_url} target="_blank">
                        {productItemShort.location}
                      </a></p>
                      <div className="address__map">
                        <Map
                          initialViewState={userLocation}

                          mapStyle="mapbox://styles/mapbox/streets-v9"
                          mapboxAccessToken={TOKEN}
                          width="100%"
                          height="250px"
                        >
                       
                          <Marker
                            longitude={userLocation.longitude}
                            latitude={userLocation.latitude} >
                            <svg width={30} viewBox="0 0 24 24" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(0 -1028.4)"> <path d="m12 0c-4.4183 2.3685e-15 -8 3.5817-8 8 0 1.421 0.3816 2.75 1.0312 3.906 0.1079 0.192 0.221 0.381 0.3438 0.563l6.625 11.531 6.625-11.531c0.102-0.151 0.19-0.311 0.281-0.469l0.063-0.094c0.649-1.156 1.031-2.485 1.031-3.906 0-4.4183-3.582-8-8-8zm0 4c2.209 0 4 1.7909 4 4 0 2.209-1.791 4-4 4-2.2091 0-4-1.791-4-4 0-2.2091 1.7909-4 4-4z" transform="translate(0 1028.4)" fill="#e74c3c"></path> <path d="m12 3c-2.7614 0-5 2.2386-5 5 0 2.761 2.2386 5 5 5 2.761 0 5-2.239 5-5 0-2.7614-2.239-5-5-5zm0 2c1.657 0 3 1.3431 3 3s-1.343 3-3 3-3-1.3431-3-3 1.343-3 3-3z" transform="translate(0 1028.4)" fill="#c0392b"></path> </g> </g></svg>
                          </Marker>
                        </Map>
                      </div>
                    </div>
                  </div>

                </Modal>
                <p >{productItemShort.name.slice(0, 20)}... <button onClick={() => setDetailModal(true)}>Read more</button></p>
                <span>${productItemShort.price}</span>
              </div>
            </div>
            <div className={`shorts_page_content ${openComment ? "hide__buttons" : ""}`}>
              <div
                className={`shorts_page_left `}
              >
                <div className=" pb-3">
                  <div className="icons">
                    <img
                      src={bag}
                      alt=""
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
                    />
                  </div>
                </div>
                <div className=" pb-3">
                  <div className="icons">
                    <WishBtn ProductItemVideoCard={productItemShort} />
                  </div>
                  {/* <span>46 </span> */}
                </div>
                <div className=" pb-3">
                  <div className="icons">
                    <ShareModal item={productItemShort} />
                  </div>
                  {/* <span>14</span> */}
                </div>
                <div className=" pb-3">
                  <div
                    className={`icons ${animate ? "animated" : ""}`}
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
                    <img src={like} alt="" />
                  </div>
                  <span>{productItemShort.like_count}</span>
                </div>


                <div className=" pb-3">
                  <div
                    className="icons"
                    onClick={() => setOpenComment(!openComment)}
                  >
                    <img src={chat} alt="" />
                  </div>
                  <span>{comments?.length}</span>
                </div>
                <div className=" pb-3">
                  <div className="icons">
                    <img src={eye} alt="" />
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
                          <img
                            src={close}
                            className="close_btn"
                            onClick={() => {
                              setOpenComment(!openComment);
                              handleLeave()
                            }}
                            alt=""
                          />
                        </div>
                      </div>

                      <div className="comments_heading  mt-3">
                        {comments?.map((comment) => {
                          console.log(comment)
                          return (
                            <div className="d-flex gap-3 comments_list mt-3">
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
                                      <img src={like} alt="like.svg" />
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
                                      <img src={replay} alt="like.svg" />
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
                                              showModal(comment.id, false);
                                            }}
                                          >
                                            <img src={delete_img} alt="" />
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
                                                    src={subComment?.user?.avatar||avatarImage}
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
                                                      <img
                                                        src={like}
                                                        alt="like.svg"
                                                      />
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
                                                                <img
                                                                  src={delete_img}
                                                                  alt=""
                                                                />
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
