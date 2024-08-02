import React, { useEffect, useState, useContext, useRef } from "react";
import useAxios from "../../../utils/useAxios";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";
import like from "../../../assets/icons/like.svg";
import replay from "../../../assets/icons/replay-rectangle.png";
import "./style.scss";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa6";
import delete_img from "../../../assets/icons/delete.svg";
import { Modal } from "antd";

const CommentsComponent = ({ productDetail }) => {
  const [comments, setComments] = useState([]);
  const [user_comment, setUser_comment] = useState("");
  const [user_comment_sub, setUser_comment_sub] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deleteIsSubComment, setDeleteIsSubComment] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSubCommentId, setShowSubCommentId] = useState(null);
  const menuRef = useRef(null);
  const axiosInstance = useAxios();
  const { user, userDetails } = useContext(AuthContext);
  const fetchParentComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/parent_comments/${productDetail.id}/`
      );
      const parentComments = response.data.results;

      // Fetch sub-comments for each parent comment
      const subCommentsPromises = parentComments.map((comment) =>
        axiosInstance.get(`/sub_comments/${comment.id}/`)
      );
      const subCommentsResponses = await Promise.all(subCommentsPromises);

      // Attach sub-comments to their respective parent comments
      const commentsWithSubComments = parentComments.map((comment, index) => ({
        ...comment,
        sub_comments: subCommentsResponses[index].data.results,
      }));

      setComments(commentsWithSubComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (productDetail && productDetail.id) {
      fetchParentComments();
      // console.log("Fetching comments for product:", productDetail.id);
    }
  }, [productDetail]);

  const handlePostComment = async (e) => {
    if (!user_comment) {
      toast.warning("Please write your comment");
      return;
    } else if (!user) {
      toast.warning("Please sign in");
      return;
    }
    const payload = {
      user: user.user_id,
      product: productDetail.id,
      comment: user_comment,
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

  const handlePostSubComment = async (e) => {
    if (!user_comment_sub) {
      toast.warning("Please write your comment");
      return;
    } else if (!user) {
      toast.warning("Please sign in");
      return;
    }
    const payload = {
      user: user.user_id,
      product: productDetail.id,
      comment: user_comment_sub,
      parent_comment: replyToCommentId,
    };
    try {
      const res = await axiosInstance.post(`/product_comment/`, payload);
      // console.log("Payload:", payload);
      // console.log("Response:", res.data);
      if (res.status === 201) {
        setUser_comment_sub("");
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
      // console.log("Response:", res.data);
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

  const handleReplyToggle = (commentId) => {
    setReplyToCommentId((prevId) => (prevId === commentId ? null : commentId));
    setUser_comment_sub("");
    if (user_comment) {
      setUser_comment("");
    }
  };

  const handleMenuToggle = (commentId) => {
    setOpenMenu((prevMenuId) => (prevMenuId === commentId ? null : commentId));
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

    const toggleSubComment = (commentId) => {
      setShowSubCommentId((prevId) => (prevId === commentId ? null : commentId));
    };
  
  return (
    <>
      <Modal
        title="Delete Comment"
        visible={isModalVisible}
        onOk={handleDeleteComment}
        onCancel={handleCancel}
        centered
        className="modal-commentdel"
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
      <div className="write_comment pt-5">
        <div className="user_comment_post_area">
          <div className="user_img">
            <img src={avatarImage} alt="avatarImage" />
          </div>
          <form
            className="comment_form"
            onSubmit={(e) => {
              e.preventDefault();
              handlePostComment();
            }}
          >
            <div className="username">{user?.username}</div>
            <input
              type="text"
              value={user_comment}
              placeholder="Write your comment...."
              onChange={(e) => setUser_comment(e.target.value)}
              onFocus={() => {
                setReplyToCommentId(null);
                setUser_comment_sub("");
              }}
            />
            <button type="submit">Publish</button>
          </form>
        </div>

        <div className="comments">
          {comments && comments.length > 0 && (
            <div className="comments_count mb-5">
              <p>{comments.length} comments</p>
            </div>
          )}

          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="mb-2">
                <div className="d-flex align-items-start gap-3 ">
                  <div className="comment_avatar">
                    <img src={comment?.user?.avatar||avatarImage} alt="avatarImage" />
                  </div>
                  <div className="w-100">
                    <h5 className="comment_user">{comment.user?.name}</h5>
                    <p className="mb-0 comment">{comment?.comment}</p>
                    <div className="mt-1 d-flex gap-3 comment_footer">
                      <div className="d-flex align-items-center gap-3">
                        <button
                          className="like-btn fill__change"
                          onClick={() => toggleCommentLike(comment.id)}
                        >
<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="like">
<path id="combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M7.62205 15.5H5.28959C3.45412 15.5 1.85419 14.2508 1.40902 12.4701L0.287751 7.98507C-0.0278224 6.72278 0.926894 5.5 2.22804 5.5H6.33315L5.59098 4.38675C4.48339 2.72536 5.67437 0.5 7.67111 0.5H7.99982L11.2014 6.10276C11.2877 6.25386 11.3331 6.42487 11.3331 6.5989V13.2981C11.3331 13.6325 11.166 13.9447 10.8879 14.1302L9.84085 14.8282C9.18378 15.2662 8.41175 15.5 7.62205 15.5ZM12.5832 6.54167V13.625C12.5832 14.6605 13.4226 15.5 14.4582 15.5C15.4937 15.5 16.3332 14.6605 16.3332 13.625V6.54166C16.3332 5.50613 15.4937 4.66667 14.4582 4.66667C13.4226 4.66667 12.5832 5.50613 12.5832 6.54167Z" fill="white"/>
</g>
</svg>
                        </button>
                        <span>{comment.like_count}</span>
                      </div>
                      <button
                        className="replay-btn fill__change"
                        onClick={() => handleReplyToggle(comment.id)}
                      >
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.00002 0.666626C2.15907 0.666626 0.666687 2.15901 0.666687 3.99996V14C0.666687 15.8409 2.15907 17.3333 4.00002 17.3333H14C15.841 17.3333 17.3334 15.8409 17.3334 14V3.99996C17.3334 2.15901 15.841 0.666626 14 0.666626H4.00002ZM7.82 5.14666C8.1072 4.95519 8.49525 5.0328 8.68672 5.32C8.87819 5.60721 8.80058 5.99525 8.51337 6.18672L7.49126 6.86813C8.62083 7.06979 9.69827 7.46437 10.5967 8.06333C11.9908 8.99269 12.9584 10.4243 12.9584 12.3334C12.9584 12.6785 12.6785 12.9584 12.3334 12.9584C11.9882 12.9584 11.7084 12.6785 11.7084 12.3334C11.7084 10.9091 11.0093 9.84069 9.90333 9.10339C9.0731 8.5499 8.01734 8.18954 6.88817 8.03884L7.85339 9.48667C8.04486 9.77388 7.96725 10.1619 7.68004 10.3534C7.39284 10.5449 7.00479 10.4673 6.81332 10.18L5.14666 7.68005C4.95519 7.39284 5.03279 7.0048 5.32 6.81333L7.82 5.14666Z" fill="var(--textColor)"></path></svg>                      </button>

                      {comment.user.id === user.user_id && (
                        <div
                          className="d-flex align-items-center gap-2"
                          ref={menuRef}
                        >
                          <button
                            className="dot_btn"
                            onClick={() => handleMenuToggle(comment.id)}
                          >
                            <HiOutlineDotsHorizontal />
                          </button>
                          {openMenu === comment.id && (
                            <div className="drop_menu">
                              <button
                              className="stroke__change"
                                onClick={() => {
                                  showModal(comment.id, false);
                                }}
                              >
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Trash/Outline">
<path id="Vector" d="M15.8333 7.49935L15.2367 15.255C15.1032 16.9917 13.655 18.3327 11.9132 18.3327H8.08677C6.34498 18.3327 4.89684 16.9917 4.76326 15.255L4.16667 7.49935M17.5 5.83268C15.3351 4.77766 12.7614 4.16602 10 4.16602C7.23862 4.16602 4.66493 4.77766 2.5 5.83268M8.33333 4.16602V3.33268C8.33333 2.41221 9.07953 1.66602 10 1.66602C10.9205 1.66602 11.6667 2.41221 11.6667 3.33268V4.16602M8.33333 9.16602V14.166M11.6667 9.16602V14.166" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <form
                      className={`reply-form ${replyToCommentId === comment.id ? "active" : ""
                        }`}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handlePostSubComment();
                      }}
                    >
                      <div className="reply-username">{user.username}</div>
                      <input
                        type="text"
                        value={user_comment_sub}
                        placeholder="Write your reply...."
                        onChange={(e) => setUser_comment_sub(e.target.value)}
                        onFocus={() => {
                          setUser_comment("");
                        }}
                      />
                      <button type="submit">Publish</button>
                    </form>
                    {comment.sub_comments.length > 0 && (
                      <button className={`reply-btn ${showSubCommentId === comment.id && "active"} `} onClick={() => toggleSubComment(comment.id)}>
                        <FaChevronDown /> {comment.sub_comments.length} reply
                      </button>
                    )}
                    {comment.sub_comments &&showSubCommentId === comment.id&&
                      comment.sub_comments.length > 0 && (
                        <div className="sub-comments">
                          {comment.sub_comments.map((subComment) => (
                            <div key={subComment.id} className="sub-comment">
                              <div className="d-flex align-items-center gap-3 mt-1">
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
                                        className="like-btn fill__change"
                                        onClick={() =>
                                          toggleCommentLike(subComment.id, true)
                                        }
                                      >
<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="like">
<path id="combo shape" fill-rule="evenodd" clip-rule="evenodd" d="M7.62205 15.5H5.28959C3.45412 15.5 1.85419 14.2508 1.40902 12.4701L0.287751 7.98507C-0.0278224 6.72278 0.926894 5.5 2.22804 5.5H6.33315L5.59098 4.38675C4.48339 2.72536 5.67437 0.5 7.67111 0.5H7.99982L11.2014 6.10276C11.2877 6.25386 11.3331 6.42487 11.3331 6.5989V13.2981C11.3331 13.6325 11.166 13.9447 10.8879 14.1302L9.84085 14.8282C9.18378 15.2662 8.41175 15.5 7.62205 15.5ZM12.5832 6.54167V13.625C12.5832 14.6605 13.4226 15.5 14.4582 15.5C15.4937 15.5 16.3332 14.6605 16.3332 13.625V6.54166C16.3332 5.50613 15.4937 4.66667 14.4582 4.66667C13.4226 4.66667 12.5832 5.50613 12.5832 6.54167Z" fill="white"/>
</g>
</svg>
                                      </button>
                                      <span>{subComment.like_count}</span>
                                    </div>
                                    {subComment.user.id === user.user_id && (
                                      <div
                                        className="d-flex align-items-center gap-2"
                                        ref={menuRef}
                                      >
                                        <button
                                          className="dot_btn"
                                          onClick={() =>
                                            handleMenuToggle(subComment.id)
                                          }
                                        >
                                          <HiOutlineDotsHorizontal />
                                        </button>
                                        {openMenu === subComment.id && (
                                          <div className="drop_menu">
                                            <button
                                       
                                            className="stroke__change"
                                              onClick={() => {
                                                showModal(subComment.id, true);
                                              }}
                                            >
<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Trash/Outline">
<path id="Vector" d="M15.8333 7.49935L15.2367 15.255C15.1032 16.9917 13.655 18.3327 11.9132 18.3327H8.08677C6.34498 18.3327 4.89684 16.9917 4.76326 15.255L4.16667 7.49935M17.5 5.83268C15.3351 4.77766 12.7614 4.16602 10 4.16602C7.23862 4.16602 4.66493 4.77766 2.5 5.83268M8.33333 4.16602V3.33268C8.33333 2.41221 9.07953 1.66602 10 1.66602C10.9205 1.66602 11.6667 2.41221 11.6667 3.33268V4.16602M8.33333 9.16602V14.166M11.6667 9.16602V14.166" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
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
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no_comments">Write first comment...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentsComponent;
