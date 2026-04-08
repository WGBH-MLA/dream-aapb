import { useState } from "react";

const VISIBLE_COUNT = 4;

export default function Carousel({ title, items = [], seeAllUrl }) {
  const [index, setIndex] = useState(0);
  const canLeft = index > 0;
  const canRight = index + VISIBLE_COUNT < items.length;
  const visible = items.slice(index, index + VISIBLE_COUNT);

  return (
    <div className="carousel-container bmarbot">

      {/* Title row */}
      <div className="carousel-title">
        <h2>
          {title}
        </h2>
        {seeAllUrl && (
          <a href={seeAllUrl}>
            See All
          </a>
        )}
      </div>

      {/* Carousel row */}
      <div className="carousel-row">

        {/* Left arrow */}
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={!canLeft}
          className={ canLeft ? "move-enabled" : "" }
          aria-label="Previous"
        >
          &lt;
        </button>

        {/* Cards */}
        <div className="carousel-body">
          {visible.map((item, i) => (
            <a
              className="carousel-card"
              key={index + i}
              href={item.url}
            >
              <div>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Lower third overlay */}
                <div className="lower-third">
                  <div>
                    {item.title}
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* Fill empty slots */}
          {Array.from({ length: VISIBLE_COUNT - visible.length }).map((_, i) => (
            <div className="carousel-emptyitem" key={`empty-${i}`} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => setIndex(i => Math.min(items.length - VISIBLE_COUNT, i + 1))}
          disabled={!canRight}
          className={ canRight ? "move-enabled" : "" }
          aria-label="Next"
        >
          &gt;
        </button>

      </div>
    </div>
  );
}