import React, { useEffect, useRef, useState, useCallback } from "react";

const API_KEY = "730a373d8a57417983b144650251207";

const SunsafeMap = ({ setUvIndex }) => {
  // Inject responsive style for mobile margin on UV index text
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@media (max-width: 600px) { .uv-index-text { margin-bottom: 12px !important; } }`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [localUv, setLocalUv] = useState(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setLocation(null);
      }
    );
  }, []);

  // Intersection Observer
  const observerCallback = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      console.log("UV map card is in view ✅");
      setIsVisible(true);
    } else {
      console.log("UV map card is out of view ❌");
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  // Fetch UV index
  useEffect(() => {
    if (!location) return;

    const { latitude, longitude } = location;

    const fetchUvIndex = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
        );
        const data = await response.json();

        if (data.error) {
          console.error("WeatherAPI error:", data.error.message);
          setLocalUv(null);
          setUvIndex(null);
          return;
        }

        setLocalUv(data.current.uv);
        setUvIndex(data.current.uv);
      } catch (error) {
        console.error("Error fetching UV index:", error);
      }
    };
    fetchUvIndex();
  }, [location, setUvIndex]);

  // Draw UV circle on canvas
  useEffect(() => {
    if (!isVisible || !location || localUv === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Responsive canvas
    const width = canvas.offsetWidth;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    let uvColor = "gray";
    if (localUv < 3) uvColor = "green";
    else if (localUv < 6) uvColor = "yellow";
    else if (localUv < 8) uvColor = "orange";
    else uvColor = "red";

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = uvColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }, [isVisible, location, localUv]);

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #ffffff, #a7d9f5)",
        minHeight: "100vh",
        padding: "1rem",
        fontFamily: "'Segoe UI', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#003366",
          fontSize: "2rem",
          marginBottom: "3rem",
        }}
      >
        ☀️ SunSafe: Stay Aware of UV Exposure
      </h1>

      {/* About Section */}
      <div
        style={{
          maxWidth: "700px",
          margin: "3rem auto",
          padding: "1.5rem",
          backgroundColor: "#fff3e0",
          borderRadius: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          color: "#333",
          lineHeight: "1.6",
          fontSize: "1rem",
        }}
      >
        <h2 style={{ color: "#ff6600" }}>🌤 Welcome to SunSafe</h2>
        <p>
          SunSafe helps you stay informed about the UV exposure risk in your
          area using real-time data. Whether you're heading out or planning your
          day, this tool will help you:
        </p>
        <ul style={{ listStyle: "none", paddingLeft: 0, margin: "2rem 0" }}>
          <li>📍 View your current UV index based on your location</li>
          <li>🎯 See a visual risk indicator for easy interpretation</li>
          <li>🧴 Get helpful protection tips based on current risk</li>
        </ul>
        <p style={{ color: "#ff6600", fontWeight: "bold", fontSize: "1.1rem" }}>
          ⬇️ Scroll down to view your UV risk level and stay protected!
        </p>
      </div>

      {/* UV Map Section */}
      <div ref={containerRef} style={{ marginTop: "2rem" }}>
        <div
          style={{
            backgroundColor: "#fffaf5",
            padding: "1.5rem",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "450px",
            margin: "2rem auto",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#ff6600", marginBottom: "1rem" }}>
            📡 Live UV Index Map
          </h3>
          <canvas
            ref={canvasRef}
            style={{
              background: "#cfecf7",
              border: "2px solid #fff",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "100%",
            }}
          />
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            marginTop: "2rem",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          <LegendItem color="green" label="Low (0-2)" />
          <LegendItem color="yellow" label="Moderate (3-5)" />
          <LegendItem color="orange" label="High (6-7)" />
          <LegendItem color="red" label="Very High (8+)" />
          <LegendItem color="white" label="You (Your Location)" />
        </div>

        {/* Info */}
        <p
          style={{
            marginTop: "0.5rem",
            color: "#191970",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.3rem",
          }}
        >
          {location
            ? `Your Location: ${location.latitude.toFixed(2)}° N, ${location.longitude.toFixed(2)}° E`
            : "Detecting Location..."}
        </p>
        <p
          style={{
            color: "#191970",
            fontWeight: "bold",
            fontSize: "1.3rem",
            textAlign: "center",
            marginBottom: "24px",
          }}
          className="uv-index-text"
        >
          {localUv !== null ? `Current UV Index: ${localUv}` : "Fetching UV Index..."}
        </p>
      </div>

    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <span
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        backgroundColor: color,
        border: color === "white" ? "1px solid #ccc" : "none",
        display: "inline-block",
      }}
    ></span>
    <span style={{ fontSize: "0.9rem", color: "black", fontWeight: "bold" }}>
      {label}
    </span>
  </div>
);

export default SunsafeMap;
