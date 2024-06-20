import React from "react";
import UploadS from "../../../UploadShorts";
import { useParams } from "react-router-dom";

const EditMyShort = () => {
  const { id } = useParams();
  return (
    <>
      <UploadS productId={id} type="Shorts" />
    </>
  );
};

export default EditMyShort;
