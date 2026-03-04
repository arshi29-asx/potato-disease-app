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

  const treatments = {
    "Early Blight": [
      "Remove infected leaves immediately",
      "Use copper-based fungicides",
      "Maintain proper plant spacing for airflow"
    ],

    "Late Blight": [
      "Apply fungicides like chlorothalonil",
      "Avoid overhead watering",
      "Remove severely infected plants"
    ],

    "Healthy": [
      "Your plant looks healthy",
      "Continue proper watering and sunlight",
      "Monitor leaves regularly for early signs"
    ]
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setResult("");
    setConfidence("");
  };

  const handleUpload = async () => {

    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await axios.post(
        "https://potato-disease-app-production.up.railway.app/predict",
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

    } catch (error) {
      alert("Prediction failed! Check backend.");
      console.error(error);
    }

    setLoading(false);
  };

  const clearAll = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setConfidence("");
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

        {/* Heading */}
        <h2>
          Potato Plant <br/> Disease Detection
        </h2>

        {/* Subtitle */}
        <p className="subtitle">
          Upload a potato leaf image to detect plant diseases instantly
        </p>

        {/* Upload Button */}
        <label className="upload-btn">
          Select Image
          <input
            type="file"
            onChange={handleFileChange}
            hidden
          />
        </label>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="preview"
          />
        )}

        {/* Buttons */}
        {preview && (
          <div className="button-group">

            <button
              className="predict-btn"
              onClick={handleUpload}
            >
              {loading ? (
                <span className="loader"></span>
              ) : (
                "Predict Disease"
              )}
            </button>

            <button
              className="clear-btn"
              onClick={clearAll}
            >
              Clear
            </button>

          </div>
        )}

        {/* Result */}
        {result && (
          <div className="result-card">

            <img
              src={preview}
              alt="leaf"
              className="result-img"
            />

            <div className="result-info">

              <div>
                <div className="label-text">Label</div>
                <div className="value-text">{result}</div>
              </div>

              <div>
                <div className="label-text">Confidence</div>
                <div className="value-text">{confidence}%</div>
              </div>

            </div>

            {/* Treatment Suggestions */}
            <div className="treatment">
              <div className="label-text">Recommended Actions</div>
              <ul>
                {treatments[result]?.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;