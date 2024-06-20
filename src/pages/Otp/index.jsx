import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
const Otp = () => {
  const [otp_code, setOtp] = useState("");
  const [email, setEmail] = useState(
    localStorage.getItem("email") ? localStorage.getItem("email") : null
  );

  const { verifyOtp, resendOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (otp, email) => {
    console.log(otp, email);
    try {
      const response = await verifyOtp(otp, email);
      console.log(response);
      localStorage.setItem("otp", JSON.stringify(otp));
      if (response.status === 200) {
        const context = localStorage.getItem("context");
        localStorage.removeItem("context");

        if (context === "register") {
          toast.success("Verification Successful, Login Now");
          navigate("/login");
        } else if (context === "forgot-password") {
          toast.success("Verification Successful, Reset Password Now");
          navigate("/user/reset-password");
        } else {
          navigate("/login");
        }
      } else if (
        response.data.message === "OTP has expired. Please request a new one."
      ) {
        toast.error("The OTP code has expired. Please request a new one.");
      } else {
        toast.error("OTP verification failed");
      }
    } catch (e) {
      console.log(e);

      if (e.response && e.response.data) {
        if (
          e.response.data.message ===
          "OTP has expired. Please request a new one."
        ) {
          toast.error("The OTP code has expired. Please request a new one.");
        } else {
          toast.error("Invalid OTP code.");
        }
      } else {
        toast.error("An error occurred during OTP verification.");
      }
    }
  };

  const handleSubmitResendOtp = async (e) => {
    try {
      const response = await resendOtp(email);
      console.log(response);
      if (response.status === 200) {
        console.log("okey");
        toast.success("Otp resend !");
        setEmail("");
        setOtp("");
      } else {
        console.log(response.status);
        console.log("there was a server issue");
        toast.error("Error");
      }
    } catch (e) {
      if (e.response && e.response.data) {
        console.log(e);
        toast.error("An error occurred:");
      }
    }
  };

  useEffect(() => {
    if (otp_code.length === 6 && email) {
      handleSubmit(otp_code, email);
    }
  }, [otp_code, email]);
  return (
    <>
      <section className="verify_otp">
        <div className="left"></div>
        <div className="right">
          <form className="box_otp" onSubmit={(e) => e.preventDefault()}>
            <img src={logo} alt="" />

            <h2>Verify your e-mail</h2>
            <OtpInput
              value={otp_code}
              onChange={(value) => setOtp(value)}
              numInputs={6}
              inputStyle="otp"
              renderInput={(props) => <input {...props} />}
            />
          </form>
          <p>
            Didn’t get your code?{" "}
            <button onClick={handleSubmitResendOtp}>Send a new code</button>
          </p>
        </div>
      </section>
    </>
  );
};

export default Otp;
