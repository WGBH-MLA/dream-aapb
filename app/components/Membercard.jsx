import { useState } from "react";

export default function MemberCard({ imgSrc, imgAlt, name, bio }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="member-card">
      <img className="img-circle" src={imgSrc} alt={imgAlt} />
      <h3>{name}</h3>
      <button className="expand-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide bio" : "Show bio"}
      </button>
      {isOpen && <div className="member-bio">{bio}</div>}
    </div>
  );
}