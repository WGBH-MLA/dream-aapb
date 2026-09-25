import { useState, useRef, useEffect } from "react";
import Thumbnail from "./Thumbnail";

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

function CarouselCard({ item, showDesc }) {
  return(
    <a className="carousel-card" href={item.url}>
      <div className="carousel-card-media">
        <Thumbnail
          url={item.thumbnailURL}
          alt={item.title} hidebar={true}
        />
        <div className="carousel-card-overlay">
          <span className="carousel-card-title">{item.title}</span>
          {showDesc && item.desc && (
            <span className="carousel-card-desc">{item.desc}</span>
          )}
        </div>
      </div>
    </a>
  );
}

function NavButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`carousel-nav-btn ${direction}`}
      aria-label={`Scroll ${direction === "left" ? "Scroll Left" : "Scroll Right"}`}
    >
      {direction === "left" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

export default function Carousel({
  title,
  items = [],
  programs = [],
  seeAllURL,
  columns,
  showDesc = false,
}) {

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const itemList = items.length > 0 ? items : programs;
  const isThreeColumn = columns === 3 || itemList.length === 3;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [itemList]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  
  const showNav = !isThreeColumn;

  return (
    <div className={`carousel-container ${isThreeColumn ? "three-columns" : ""}`}>

      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {seeAllURL && (
          <a className="carousel-see-all" href={seeAllURL}>
            See All <span className="carousel-see-all-arrow">&rsaquo;</span>
          </a>
        )}
      </div>

      <div className="carousel-slider-wrapper">
        {showNav && canScrollLeft && (
          <NavButton
            direction="left"
            onClick={() => handleScroll("left")}
          />
        )}

        <div className="carousel-track" ref={scrollRef}>
          {itemList.map((item, index) => (
            <CarouselCard key={index} item={item} showDesc={showDesc} />
          ))}
        </div>

        {showNav && canScrollRight && (
          <NavButton
            direction="right"
            onClick={() => handleScroll("right")}
          />
        )}
      </div>
    </div>
  );
}