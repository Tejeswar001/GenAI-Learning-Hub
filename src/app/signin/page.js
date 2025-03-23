"use client";
import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./signin.css";

const SignIn = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const signInBtn = document.querySelector("#sign-in-btn");
    const signUpBtn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    if (signInBtn && signUpBtn && container) {
      signUpBtn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });

      signInBtn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    }

    return () => {
      signUpBtn?.removeEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });
      signInBtn?.removeEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      {user ? (
        <div className="welcome-container">
          <h2>Welcome, {user.email}!</h2>
          <button className="btn solid" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <>
          <div className="forms-container">
            <div className="signin-signup">
              <form className="sign-in-form" onSubmit={handleSignIn}>
                <h2 className="title">Sign In</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn solid">Login</button>
                <p className="social-text">Or Sign in with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <img src="/facebook.svg" className="social-icon" alt="Facebook" />
                  </a>
                  <a href="#" className="social-icon" onClick={handleGoogleSignIn}>
                    <img src="/google.svg" className="social-icon" alt="Google" />
                  </a>
                  <a href="#" className="social-icon">
                    <img src="/github.svg" className="social-icon" alt="GitHub" />
                  </a>
                </div>
              </form>

              <form className="sign-up-form" onSubmit={handleSignUp}>
                <h2 className="title">Sign Up</h2>
                <div className="input-field">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn solid">Sign Up</button>
                <p className="social-text">Or Sign up with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <img src="/facebook.svg" className="social-icon" alt="Facebook" />
                  </a>
                  <a href="#" className="social-icon" onClick={handleGoogleSignIn}>
                    <img src="/google.svg" className="social-icon" alt="Google" />
                  </a>
                  <a href="#" className="social-icon" onClick={handleGithubSignIn}>
                    <img src="/github.svg" className="social-icon" alt="GitHub" />
                  </a>
                </div>
              </form>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Join us and explore amazing features.</p>
                <button className="btn transparent" id="sign-up-btn">
                  Sign Up
                </button>
              </div>
              <img src="/log.svg" className="image" alt="" />
            </div>

            <div className="panel right-panel">
              <div className="content">
                <h3>One of us?</h3>
                <p>Log in to continue your journey.</p>
                <button className="btn transparent" id="sign-in-btn">
                  Sign In
                </button>
              </div>
              <img src="/register.svg" className="image" alt="" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignIn;
