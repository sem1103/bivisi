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
                          className="like-btn"
                          onClick={() => toggleCommentLike(comment.id)}
                        >
                          <img src={like} alt="like.svg" />
                        </button>
                        <span>{comment.like_count}</span>
                      </div>
                      <button
                        className="replay-btn"
                        onClick={() => handleReplyToggle(comment.id)}
                      >
                        <img src={replay} alt="replay.svg" />
                      </button>

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
                                        className="like-btn"
                                        onClick={() =>
                                          toggleCommentLike(subComment.id, true)
                                        }
                                      >
                                        <img src={like} alt="like.svg" />
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
                                              onClick={() => {
                                                showModal(subComment.id, true);
                                              }}
                                            >
                                              <img src={delete_img} alt="" />
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
