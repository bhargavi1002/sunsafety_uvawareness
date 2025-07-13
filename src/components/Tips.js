import React from "react";

const getTipsForUV = (uv) => {
  if (uv < 3) {
    return {
      level: "Low Risk",
      advice: [
        "😎 Safe to be outside.",
        "🌤️ No extra sun protection needed.",
        "🧴 Sunscreen is optional."
      ],
      color: "green"
    };
  } else if (uv < 6) {
    return {
      level: "Moderate Risk",
      advice: [
        "🧴 Use SPF 30+ sunscreen.",
        "🧢 Wear a hat and sunglasses.",
        "☀️ Try to avoid mid-day sun (10am-4pm)."
      ],
      color: "yellow"
    };
  } else if (uv < 8) {
    return {
      level: "High Risk",
      advice: [
        "🧴 Use SPF 50+ sunscreen.",
        "🕶️ Wear sunglasses and protective clothing.",
        "⛱️ Stay in the shade when possible."
      ],
      color: "orange"
    };
  } else {
    return {
      level: "Very High Risk",
      advice: [
        "⚠️ Minimize sun exposure.",
        "🧴 Apply and reapply sunscreen frequently.",
        "👒 Avoid going out in direct sunlight."
      ],
      color: "red"
    };
  }
};

const Tips = ({ uvIndex }) => {
  if (uvIndex == null) return null;

  const { level, advice, color } = getTipsForUV(uvIndex);

  return (
    <>
      {/* Tips Section */}
      <section
        style={{
          maxWidth: "700px",
          margin: "2rem auto",
          backgroundColor: "#fffaf5",
          borderLeft: `8px solid ${color}`,
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ color: "#191970", marginBottom: "1rem" }}>
          ☀️ UV Safety Tips - {level}
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "1.8" }}>
          {advice.map((tip, index) => (
            <li key={index} style={{ fontSize: "1rem", color: "#333" }}>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* UV Safety Resources Section */}
      <section
        style={{
          backgroundColor: "#fff3e0",
          padding: "1.5rem",
          margin: "2rem auto",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "700px",
          lineHeight: "1.6",
          color: "#333",
        }}
      >
        <h3 style={{ color: "#ff6600", marginBottom: "1rem" }}>📖 Learn More About UV Safety</h3>
        <ul style={{ paddingLeft: "1.2rem", listStyle: "none", margin: 0 }}>
          <li>
            👉 <a href="https://www.aad.org/member/advocacy/promote/uv-awareness" target="_blank" rel="noopener noreferrer">EPA Sun Safety Guidelines</a>
          </li>
          <li>
            👉 <a href="https://www.cdc.gov/skin-cancer/sun-safety/index.html" target="_blank" rel="noopener noreferrer">CDC Skin Cancer Prevention</a>
          </li>
          <li>
            👉 <a href="https://www.cancer.org/cancer/risk-prevention/sun-and-uv/uv-protection.html" target="_blank" rel="noopener noreferrer">WHO on UV Radiation & Risks</a>
          </li>
          <li>
            👉 <a href="https://www.qualitycare-er.com/wellness-blog/2024/june/skin-safety-in-the-sun-importance-of-sunscreen-a/" target="_blank" rel="noopener noreferrer">Skin Cancer Foundation: Prevention Tips</a>
          </li>
        </ul>
        <p style={{ marginTop: "1rem", color: "#cc5500", fontWeight: "bold" }}>
          🌞 Stay safe and stay informed!
        </p>
      </section>
    </>
  );
};

export default Tips;
