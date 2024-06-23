import React, { useState } from "react";
import close from "../../assets/icons/close.svg";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
  PinterestShareButton,
  PinterestIcon,
} from "react-share";
import Modal from "react-bootstrap/Modal";
import share from "../../assets/icons/share-rectangle.svg";

const ShareModal = ({ item }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const shareUrl = `${window.location.origin}/${item?.product_link}`;
  console.log(shareUrl);

  return (
    <>
      <button className="share-btn" onClick={handleShow}>
        <img src={share} alt="" />
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <div className="d-flex align-items-center justify-content-between modal_head">
          <h1>Share</h1>
          <img onClick={handleClose} src={close} alt="" />
        </div>
        <div className="share_icons">
          <FacebookShareButton
            url={shareUrl}
            quote="Share this video"
            hashtag="#fb"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <WhatsappShareButton
            url={shareUrl}
            title="Share this video"
            separator=":: "
            hashtag="#vp"
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <TelegramShareButton
            url={shareUrl}
            title="Share this video"
            hashtag="#tg"
          >
            <TelegramIcon size={40} round />
          </TelegramShareButton>
          <EmailShareButton
            url={shareUrl}
            subject="Check out this video"
            body="Share this video with you"
            hashtag="#email"
          >
            <EmailIcon size={40} round />
          </EmailShareButton>
          <LinkedinShareButton
            url={shareUrl}
            subject="Check out this video"
            body="Share this video with you"
            hashtag="#link"
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <TwitterShareButton
            url={shareUrl}
            subject="Check out this video"
            body="Share this video with you"
            hashtag="#twt"
          >
            <TwitterIcon size={40} round />
          </TwitterShareButton>

          <PinterestShareButton
            url={shareUrl}
            subject="Check out this video"
            body="Share this video with you"
            hashtag="#pintrest"
          >
            <PinterestIcon size={40} round />
          </PinterestShareButton>
          <RedditShareButton
            url={shareUrl}
            subject="Check out this video"
            body="Share this video with you"
            hashtag="#reddit"
          >
            <RedditIcon size={40} round />
          </RedditShareButton>
        </div>
      </Modal>
    </>
  );
};

export default ShareModal;
