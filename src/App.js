import React from "react";
import "./App.css";
import bookCover from "./book-cover.png"; // adjust path if using /assets

function App() {
  return (
    <div className="App">
      <h1>The Autistic Passport</h1>

      {/* Hook statement */}
      <p className="hook">
        An essential guide for autistic men to master neurotypical social skills, 
        navigate group dynamics, understand male peer interaction, and gain 
        practical romantic advice for dating.
      </p>

      {/* Cover image */}
      <img
        src={bookCover}
        alt="The Autistic Passport Cover"
        className="book-cover"
      />

      {/* Mini Table of Contents */}
      <div className="toc">
        <h2>Inside you'll discover:</h2>
        <ul>
          <li>Decoding neurotypical social cues</li>
          <li>Thriving in male peer groups</li>
          <li>Recognizing manipulation & bullying</li>
          <li>Flirting and dating advice tailored for autistic men</li>
          <li>Building meaningful friendships and relationships</li>
        </ul>
      </div>

      {/* Buttons */}
      <p>Amazon Book Link (coming soon)</p>
      <button className="download-btn">Download Free Ebook (coming soon)</button>
    </div>
  );
}

export default App;
