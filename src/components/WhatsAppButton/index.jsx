import React from "react";
import { WhatsappIcon } from "react-share";

const WhatsAppButton = ({ phoneNumber, productUrl }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(`Check out this product: ${productUrl}`)}`;

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="wp">
      <WhatsappIcon size={40} round />
    </a>
  );
};

export default WhatsAppButton;
