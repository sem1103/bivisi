import React from "react";
import UploadS from "../../../UploadShorts";
import { useParams } from "react-router-dom";

const EditVideo = () => {
  const { id } = useParams();
  return (
    <>
      <UploadS productId={id} type="Video" />
    </>
  );
};

export default EditVideo;
