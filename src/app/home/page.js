'use client';

import React from "react";

export default function Home() {
  return (
    <main className="container">
      <div className="stars" />
      
      <h1 className="title">AI-Powered Inclusive Education</h1>
      <p className="tagline">
        Bridging the digital divide through immersive learning experiences for rural students.
      </p>

      <section className="features">
        <div className="feature">
          <h2>🎥 AI-Generated Video Lessons</h2>
          <p>
            Convert curriculum into interactive videos with local language narration. Ideal for students with low literacy or no access to qualified teachers.
          </p>
        </div>

        <div className="feature">
          <h2>🤖 AI-Powered Doubt Solving Chatbot</h2>
          <p>
            Let students ask questions in their native language. The chatbot replies using voice-based explanations powered by STT & TTS technologies.
          </p>
        </div>
      </section>

      <footer className="footer">
        🚀 Empowering Education with AI • Made for Marginalized Communities
      </footer>

      <style jsx>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }

        .container {
          position: relative;
          height: 100vh;
          width: 100vw;
          padding: 40px 20px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          background: linear-gradient(135deg, #000, #0c0e17, #1a1c2b);
          overflow: hidden;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 200%;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 2px, transparent 2px);
          background-size: 100px 100px; /* Increased gap */
          background-repeat: repeat;
          animation: moveUp 20s linear infinite;
          z-index: 0;
        }

        @keyframes moveUp {
          0% {
            background-position-y: 0;
          }
          100% {
            background-position-y: -160px;
          }
        }

        .title {
          font-size: 3rem;
          font-weight: bold;
          color: #ffffff;
          margin-bottom: 20px;
          z-index: 1;
        }

        .tagline {
          font-size: 1.1rem;
          color: #cccccc;
          margin-bottom: 40px;
          max-width: 600px;
          z-index: 1;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 100%;
          max-width: 700px;
          z-index: 1;
        }

        .feature {
          background-color: rgba(255, 255, 255, 0.07);
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 0 24px rgba(160, 100, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(6px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 32px rgba(190, 120, 255, 0.4);
        }

        .feature h2 {
          font-size: 22px;
          color: #e0dfff;
          margin-bottom: 10px;
        }

        .feature p {
          font-size: 16px;
          color: #dddddd;
        }

        .footer {
          margin-top: 40px;
          font-size: 14px;
          color: #888;
          z-index: 1;
        }
      `}
      </style>
    </main>
  );
}
