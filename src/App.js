import React from "react";
import "./App.css";
import bookCover from "./book-cover.png"; // adjust path if using /assets

function App() {
  return (
    <div className="App">
      <h1>The Autistic Passport</h1>

      {/* Cover image */}
      <img
        src={bookCover}
        alt="The Autistic Passport Cover"
        className="book-cover"
      />

      <p>Amazon Book Link (coming soon)</p>
      <button className="download-btn">Download Free Ebook (coming soon)</button>
    </div>
  );
}

export default App;
