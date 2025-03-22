"use client"
import React from "react";
import "./signin.css";
import "./SigninForm.js";

const SignIn = () => {
  return (
    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SignIn&amp;SignUp</title>
  <link rel="stylesheet" type="text/css" href="./style.css" />
  <div className="container">
    <div className="forms-container">
      <div className="signin-signup">
        <form action="" className="sign-in-form">
          <h2 className="title">Sign In</h2>
          <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" placeholder="Username" />
          </div>
          <div className="input-field">
            <i className="fas fa-lock" />
            <input type="password" placeholder="Password" />
          </div>
          <input type="submit" defaultValue="Login" className="btn solid" />
          <p className="social-text">Or Sign in with social platforms</p>
          <div className="social-media">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter" />
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-google" />
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
        </form>
        <form action="" className="sign-up-form">
          <h2 className="title">Sign Up</h2>
          <div className="input-field">
            <i className="fas fa-user" />
            <input type="text" placeholder="Username" />
          </div>
          <div className="input-field">
            <i className="fas fa-envelope" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="input-field">
            <i className="fas fa-lock" />
            <input type="password" placeholder="Password" />
          </div>
          <input type="submit" defaultValue="Sign Up" className="btn solid" />
          <p className="social-text">Or Sign up with social platforms</p>
          <div className="social-media">
            <a href="./facebook.svg" className="social-icon">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="./github.svg" className="social-icon">
              <i className="fab fa-twitter" />
            </a>
            <a href="./google.svg" className="social-icon">
              <i className="fab fa-google" />
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
        </form>
      </div>
    </div>
    <div className="panels-container">
      <div className="panel left-panel">
        <div className="content">
          <h3>New here?</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio minus
            natus est.
          </p>
          <button className="btn transparent" id="sign-up-btn">
            Sign Up
          </button>
        </div>
        <img src="./log.svg" className="image" alt="" />
      </div>
      <div className="panel right-panel">
        <div className="content">
          <h3>One of us?</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio minus
            natus est.
          </p>
          <button className="btn transparent" id="sign-in-btn">
            Sign In
          </button>
        </div>
        <img src="./register.svg" className="image" alt="" />
      </div>
    </div>
  </div>
</>

  );
};


export default SignIn;
