import { useState } from "react";

const VISIBLE_COUNT = 4;

export default function Carousel({ title, items = [], seeAllUrl }) {
  const [index, setIndex] = useState(0);

  const canLeft = index > 0;
  const canRight = index + VISIBLE_COUNT < items.length;

  const visible = items.slice(index, index + VISIBLE_COUNT);

  return (
    <div style={{ width: "96%", marginLeft: "2em", marginBottom: "4em" }}>

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: "0.5em" }}>
        <h2 style={{ marginLeft: "1em", marginBottom: 0, fontWeight: "bold", fontSize: "1.5em" }}>
          {title}
        </h2>
        {seeAllUrl && (
          <a href={seeAllUrl} style={{ marginLeft: "1.5em", fontWeight: "bold", textDecoration: "none", color: "#4b4fa5", fontSize: "0.9em" }}>
            See All
          </a>
        )}
      </div>

      {/* Carousel row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>

        {/* Left arrow */}
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={!canLeft}
          style={{
            background: "none",
            border: "none",
            fontSize: "2em",
            cursor: canLeft ? "pointer" : "default",
            color: canLeft ? "#3c429d" : "#ccc",
            padding: "0 0.3em",
            flexShrink: 0,
          }}
          aria-label="Previous"
        >
          &lt;
        </button>

        {/* Cards */}
        <div style={{ display: "flex", gap: "1.2em", flex: 1, overflow: "hidden" }}>
          {visible.map((item, i) => (
            <a
              key={index + i}
              href={item.url}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div style={{
                width: "100%",
                aspectRatio: "16/9",
                overflow: "hidden",
                borderRadius: "4px",
                position: "relative",
              }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Lower third overlay */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                  padding: "1.8em 0.7em 0.6em",
                }}>
                  <div style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "0.85em",
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {item.title}
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* Fill empty slots */}
          {Array.from({ length: VISIBLE_COUNT - visible.length }).map((_, i) => (
            <div key={`empty-${i}`} style={{ flex: "1 1 0", minWidth: 0 }} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => setIndex(i => Math.min(items.length - VISIBLE_COUNT, i + 1))}
          disabled={!canRight}
          style={{
            background: "none",
            border: "none",
            fontSize: "2em",
            cursor: canRight ? "pointer" : "default",
            color: canRight ? "#3c429d" : "#ccc",
            padding: "0 0.3em",
            flexShrink: 0,
          }}
          aria-label="Next"
        >
          &gt;
        </button>

      </div>
    </div>
  );
}
