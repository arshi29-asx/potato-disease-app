import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import bg from "./assets/bg.jpg";

function App() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult("");
    setConfidence("");
  };

  const handleUpload = async () => {

    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      let disease = response.data.class;

      if (disease === "Potato___Early_blight") {
        disease = "Early Blight";
      }
      else if (disease === "Potato___Late_blight") {
        disease = "Late Blight";
      }
      else {
        disease = "Healthy";
      }

      setResult(disease);
      setConfidence((response.data.confidence * 100).toFixed(2));
    }
    catch (error) {
      alert("Prediction failed! Check backend.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="card">

        <h2>Potato Disease Detection</h2>

        <input type="file" onChange={handleFileChange} />



        <br /><br />

        <button onClick={handleUpload}>
          {loading ? "Predicting..." : "Predict"}
        </button>

        {result && (
  <div className="result-card">

    <img
      src={preview}
      alt="leaf"
      className="result-img"
    />

    <div className="result-info">
      <div>
        <div className="label-text">Label:</div>
        <div className="value-text">{result}</div>
      </div>

      <div>
        <div className="label-text">Confidence:</div>
        <div className="value-text">{confidence}%</div>
      </div>
    </div>

  </div>
)}

      </div>
    </div>
  );
}

export default App;