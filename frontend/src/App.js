import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import bg from "./assets/bg.jpg";
import early from "./assets/early.jpg";
import late from "./assets/late.jpg";
import healthy from "./assets/healthy.jpg";

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

  const diseaseInfo = {
    "Early Blight":
      "Early blight is a common potato disease caused by the fungus Alternaria solani. It appears as dark circular spots on leaves and can reduce crop yield if not treated early.",

    "Late Blight":
      "Late blight is a serious potato disease caused by the pathogen Phytophthora infestans. It spreads quickly in cool and humid conditions and can destroy crops rapidly.",

    "Healthy":
      "The potato leaf appears healthy with no visible signs of disease. Continue monitoring the plant and maintain proper watering and sunlight."
  };

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    setResult("");
    setConfidence("");
  };

  // ⭐ Sample image loader
  const handleSample = async (img) => {

    const response = await fetch(img);
    const blob = await response.blob();

    const file = new File([blob], "sample.jpg", {
      type: "image/jpeg",
    });

    setFile(file);
    setPreview(img);

    setResult("");
    setConfidence("");
  };

  const handleUpload = async () => {

    if (!file || loading) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await axios.post(
        "https://potato-disease-app-production.up.railway.app/predict",
        formData
      );

      let disease = response.data.class;

      if (disease === "Potato___Early_blight") {
        disease = "Early Blight";
      } else if (disease === "Potato___Late_blight") {
        disease = "Late Blight";
      } else {
        disease = "Healthy";
      }

      setResult(disease);
      setConfidence((response.data.confidence * 100).toFixed(2));

    } catch (error) {

      console.error("Prediction error:", error);
      alert("Prediction failed. Please try again.");

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

        <h2>
          Potato Plant <br /> Disease Detection
        </h2>

        <p className="subtitle">
          Upload a potato leaf image to detect plant diseases instantly
        </p>

        {/* Upload button */}
        {!preview && (
          <label className="upload-btn">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        )}

        {/* ⭐ Sample images */}
        {!preview && (
          <div className="samples">

            <p>or try a sample image</p>

            <div className="sample-images">

              <img
                src={early}
                alt="Early Blight"
                onClick={() => handleSample(early)}
              />

              <img
                src={late}
                alt="Late Blight"
                onClick={() => handleSample(late)}
              />

              <img
                src={healthy}
                alt="Healthy"
                onClick={() => handleSample(healthy)}
              />

            </div>

          </div>
        )}

        {/* Preview Image */}
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
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="loader"></span>
                  AI analyzing plant health...
                </span>
              ) : (
                "Predict Disease"
              )}
            </button>

            <button
              className="clear-btn"
              onClick={clearAll}
            >
              Select New Image
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
                <div className="label-text">Disease</div>
                <div className="value-text">{result}</div>
              </div>

              <div>
                <div className="label-text">Confidence</div>
                <div className="value-text">{confidence}%</div>
              </div>

            </div>

            <div className="disease-info">
              <div className="label-text">About this Disease</div>
              <p>{diseaseInfo[result]}</p>
            </div>

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

