import { useState, useRef, useEffect } from "react";
import Thumbnail from "./Thumbnail";

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

  const itemList = items && items.length > 0 ? items : programs || [];
  const seeAll = seeAllURL;

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
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
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

  return (
    <div className={`carousel-container ${isThreeColumn ? "three-columns" : ""}`}>

      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {seeAll && (
          <a className="carousel-see-all" href={seeAll}>
            See All <span className="carousel-see-all-arrow">&rsaquo;</span>
          </a>
        )}
      </div>

      <div className="carousel-slider-wrapper">
        {!isThreeColumn && canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="carousel-nav-btn left"
            aria-label="Scroll Left"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="carousel-track" ref={scrollRef}>
          {itemList.map((item, index) => {

            const cardLink = item.url || item.link || (item.guid ? `/catalog/${item.guid}` : "#");

            const directImgUrl = item.thumbnailURL || item.img || item.thumbnail || item.image;
            const description = item.desc || item.description;

            let thumb;
            if (item.guid) {
              thumb = (
                <Thumbnail
                  guid={item.guid}
                  mediaType={item.mediaType || item.media_type}
                  alt={item.title || ""}
                  hideBar={true}
                />
              );
            } else {
              thumb = (
                <Thumbnail
                  url={directImgUrl}
                  alt={item.title || ""}
                  hideBar={true}
                />
              );
            }

            return (
              <a className="carousel-card" key={item.key || item.guid || index} href={cardLink}>
                <div className="carousel-card-media">
                  {thumb}
                  <div className="carousel-card-overlay">
                    <span className="carousel-card-title">{item.title}</span>
                    {showDesc && description && (
                      <span className="carousel-card-desc">{description}</span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {!isThreeColumn && canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="carousel-nav-btn right"
            aria-label="Scroll Right"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}