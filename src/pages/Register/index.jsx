import React, { useContext, useState } from "react";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import eyeoff from "../../assets/icons/eye-off.svg";
import eye from "../../assets/icons/eye.svg";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";
import { isPasswordValid } from "../../utils/validation";
import Cookies from 'js-cookie';
import { useGoogleLogin } from '@react-oauth/google';
import { useFacebookLogin } from "facebook-oauth-react";


const Register = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password1: false,
    password2: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const navigate = useNavigate();

  const { registerUser, fetchGoogleUserDetails, fetchFaceboookUserDetails } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Username cannot be empty";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "User last name cannot be empty";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password cannot be empty";
    } else if (!isPasswordValid(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and contain at least one uppercase letter, one number and one special character.";
    }

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Passwords do not match";
    }
    if (!checked) {
      newErrors.checked = "Accept terms of use";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await toast.promise(registerUser(formData), {
        loading: "Processing...",
        success:
          "Registration Successful, Please Check Your Email and Verify Otp Code",
        error: (err) => {
          if (err.response && err.response.status === 400 && err.response.data.email) {
            return "This email address is already in use. Please use a different email address or log in to your account";
          } else if ( err.response && err.response.status === 400 && err.response.data.username) {
            return "This username is already taken. Please choose a different username.";
          }
          return "There was a server issue";
        },
      });

      if (response.status === 201) {
        console.log("okey");
        console.log(formData);
        
        Cookies.set('email', formData.email, { expires: 1, path: '/', secure: true, sameSite: 'Strict' });

        localStorage.setItem("context", "register");
        setFormData({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          password_confirm: "",
        });
        setChecked(false);
        navigate("/user/verify-otp");
      } else {
        console.log(response.status);
        console.log("there was a server issue");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (authResponse) => {
      fetchGoogleUserDetails(authResponse)
      navigate('/');

    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const facebookLogin = useFacebookLogin({
    onSuccess: (authResponse) => {
      fetchFaceboookUserDetails(authResponse);
      navigate('/');
    }
  });


  return (
    <section className="register">
      <div className="left"></div>
      <div className="right">
        <div className="logo mb-5">
          <Link to='/'><img src={logo} alt="" /></Link>
        </div>
        <div className="right-content">
          <h5>Create new account</h5>
          <p>
          Already have an account? {" "}
            <span>
              <NavLink to={"/login"}>Login</NavLink>
            </span>
          </p>
        </div>

        <div className="soc__login">
                <div className="google__login" >
                  {/* <button type="button" onClick={() => googleLogin()}>Sign in with Google 🚀 </button> */}

                 
                    <button type="button" onClick={() => googleLogin()}>
                      <div class="svg-wrapper-1" >
                        <div class="svg-wrapper">
                          <svg viewBox="0 0 48 48" width={18}>
                            <title>Google Logo</title>
                            <clipPath id="g">
                              <path
                                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                              ></path>
                            </clipPath>
                            <g clip-path="url(#g)" class="colors">
                              <path d="M0 37V11l17 13z" fill="#FBBC05"></path>
                              <path d="M0 11l17 13 7-6.1L48 14V0H0z" fill="#EA4335"></path>
                              <path d="M0 37l30-23 7.9 1L48 0v48H0z" fill="#34A853"></path>
                              <path d="M48 48L17 24l-4-3 35-10z" fill="#4285F4"></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div class="text">oogle</div>
                    </button>


                 

                </div>
                <div className="fb__login">
                  {/* <button type="button" onClick={() => facebookLogin()}>Sign in with Facebook 🚀 </button> */}
                  <button type="button" onClick={() => facebookLogin()}>
                    <div class="svg-wrapper-1" >
                      <div class="svg-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"> <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path> </svg>
                      </div>
                    </div>
                    <div class="text">acebook</div>
                  </button>


                </div>
              </div>

        <form onSubmit={handleSubmitRegister}>
          <div className="wrapper">
            <div className="input-data">
              <input
                type="text"
                name="username"
                onChange={handleChange}
                value={formData.username}
              />
              <label>Username</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.username && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.username}
                </>
              )}
            </div>

            <div className="input-data mt-5">
              <input
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
              />
              <label>First Name</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.first_name && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.first_name}
                </>
              )}
            </div>
            <div className="input-data mt-5">
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <label>Last Name</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.last_name && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.last_name}
                </>
              )}
            </div>
            <div className="input-data mt-5">
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={formData.email}
              />
              <label>E-mail address</label>
            </div>
            <div className={errors.email ? "error" : ""}>
              {errors.email && (
                <>
                  <i className="fas fa-exclamation-circle"></i> {errors.email}
                </>
              )}
            </div>
            <div className="input-data mt-5">
              <input
                type={showPassword.password1 ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formData.password}
              />
              <div
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password1")}
              >
                <img src={showPassword.password1 ? eye : eyeoff} alt="" />
              </div>
              <label>Password</label>
            </div>
            <div className={errors.password ? "error" : ""}>
              {errors.password && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.password}
                </>
              )}
            </div>

            <div className="input-data mt-5">
              <input
                type={showPassword.password2 ? "text" : "password"}
                name="password_confirm"
                onChange={handleChange}
                value={formData.password_confirm}
              />
              <div
                className="password-toggle"
                onClick={() => togglePasswordVisibility("password2")}
              >
                <img src={showPassword.password2 ? eye : eyeoff} alt="" />
              </div>
              <label>Confirm Password</label>
            </div>
            <div className={errors.password_confirm ? "error" : ""}>
              {errors.password_confirm && (
                <>
                  <i className="fas fa-exclamation-circle"></i>{" "}
                  {errors.password_confirm}
                </>
              )}
            </div>
            <div className="pt-4 form-check">
              <div className="d-flex gap-2">
                <label className="checkbox-container d-flex">
                  <input
                    type="checkbox"
                    value={checked}
                    name="checked"
                    onChange={() => setChecked((state) => !state)}
                  />
                  <span className="checkmark me-2"></span>
                  <div>
                    By creating account, you agree our <a>Terms of use</a> and{" "}
                    <a>Privacy Policy</a>
                  </div>
                </label>
              </div>
            </div>
            <div className={errors.checked ? "error" : ""}>
              {errors.checked && (
                <>
                  <i className="fas fa-exclamation-circle"></i> {errors.checked}
                </>
              )}
            </div>

            <div className="pt-4">
              <button type="submit">Register</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
