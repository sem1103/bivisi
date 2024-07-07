import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import bag from "../../assets/icons/Bag-3.svg";
import { handleAddToBasket } from "../../helpers";
import { useCart } from "react-use-cart";

import shortsp_img from "../../assets/images/shorts-page-card.png";
import like from "../../assets/icons/like-light.svg";
import chat from "../../assets/icons/chat-ligth.svg";
import heart from "../../assets/icons/heart-light.svg";
import share from "../../assets/icons/share-light.svg";
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
import Comments from "../../pages/ProductDetail/Comments";
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
  const [openDelComment, setOpenDComment] = useState(false);
  const { addItem } = useCart();
console.log(product);
  const playerRef = useRef(null);
  const menuRef = useRef(null);
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
  const [comments, setComments] = useState([]);
  const [user_comment, setUser_comment] = useState("");
  const [user_reply, setUserReply] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [openMenu, setOpenMenu] = useState({});
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deleteIsSubComment, setDeleteIsSubComment] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

            <div className={`main ${openComment ? "comment-open" : ""}`} onClick={() => {
              !isPlaying ? playerRef.current.getInternalPlayer().play() : playerRef.current.getInternalPlayer().pause();
              isPlaying = !isPlaying;


            }}>

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

              <div className="sp_desc">
                <p className="mb-5">{productItemShort.name.slice(0, 20)}... <button>Read more</button></p>
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
                  <span>23</span>
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
                          return (
                            <div className="d-flex gap-3 mt-3">
                              <div className="comment_avatar">
                                <img src={comment?.user?.avatar} alt="" />
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
                                    <img src={avatarImage} alt="" />
                                  </div>
                                  <div className="d-flex flex-column align-items-start justify-content-cneter">
                                    <h1>{user.username}</h1>
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
                                {comment.sub_comments &&
                                  comment.sub_comments.length > 0 && (
                                    <div className="sub-comments">
                                      {comment.sub_comments.map(
                                        (subComment) => (
                                          <div
                                            key={subComment.id}
                                            className="sub-comment"
                                          >
                                            <div className="d-flex align-items-center gap-3 mt-1">
                                              <div className="comment_avatar">
                                                <p className="mb-0">
                                                  <img
                                                    src={avatarImage}
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
