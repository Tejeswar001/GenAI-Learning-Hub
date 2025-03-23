'use client';

import React from "react";

export default function Home() {
  return (
    <main className="container">
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
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .container {
          height: 100vh;
          width: 100vw;
          padding: 40px 20px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          background: linear-gradient(to bottom right, #e3f2fd, #ffffff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .title {
          font-size: 36px;
          font-weight: bold;
          color: #1a237e;
          margin-bottom: 20px;
        }

        .tagline {
          font-size: 18px;
          color: #333;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 100%;
          max-width: 700px;
        }

        .feature {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .feature h2 {
          font-size: 22px;
          color: #0d47a1;
          margin-bottom: 10px;
        }

        .feature p {
          font-size: 16px;
          color: #555;
        }

        .footer {
          margin-top: 40px;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </main>
  );
}
