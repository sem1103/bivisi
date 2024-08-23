import React, { useState } from "react";

import './style.scss'
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
import { Modal } from "antd";
import { CModal } from "@coreui/react";


const ShareModal = ({ item }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const shareUrl = `${window.location.origin}/${item?.product_link}`;
  // console.log(shareUrl);

  return (
    <>
      <button className="share-btn" onClick={handleShow}>
        {/* <img src={share} alt="" /> */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="share-rectangle">
            <path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M4.00033 0.666992C2.15938 0.666992 0.666992 2.15938 0.666992 4.00033V14.0003C0.666992 15.8413 2.15938 17.3337 4.00033 17.3337H14.0003C15.8413 17.3337 17.3337 15.8413 17.3337 14.0003V4.00033C17.3337 2.15938 15.8413 0.666992 14.0003 0.666992H4.00033ZM10.1803 5.14703C9.89314 4.95556 9.5051 5.03317 9.31363 5.32037C9.12216 5.60758 9.19977 5.99562 9.48697 6.18709L10.5091 6.8685C9.37951 7.07016 8.30207 7.46474 7.40364 8.06369C6.00959 8.99306 5.04199 10.4246 5.04199 12.3337C5.04199 12.6789 5.32181 12.9587 5.66699 12.9587C6.01217 12.9587 6.29199 12.6789 6.29199 12.3337C6.29199 10.9095 6.99106 9.84106 8.09701 9.10376C8.92724 8.55027 9.98301 8.18991 11.1122 8.03921L10.147 9.48704C9.95549 9.77424 10.0331 10.1623 10.3203 10.3538C10.6075 10.5452 10.9956 10.4676 11.187 10.1804L12.8537 7.68041C13.0452 7.39321 12.9676 7.00516 12.6803 6.81369L10.1803 5.14703Z" fill="var(--textColor)" />
          </g>
        </svg>

      </button>
      <CModal
        alignment="center"

        visible={show}
        onClose={handleClose}
        className={'modal__body chat__modal share__modal'}
      >
         <button
        className="close__modal stroke__change"
        onClick={() => {
          handleClose()
        }}
        >
        <svg width={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
        </button>
        <div className="d-flex align-items-center justify-content-between modal_head">
          <h1>Share</h1>
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
      </CModal>
    </>
  );
};

export default ShareModal;
