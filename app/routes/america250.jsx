import { useLoaderData } from 'react-router'
import Carousel from '../components/Carousel';

export const loader = async () => {
  const key_events = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const culture = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const innovation = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const southwest = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const northwest = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const midwest = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const northeast = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];
  const southeast = [
      { title: "Black Journal", url: "/exhibits/black-journal", thumbnail: "https://..." },
      { title: "ZOOM (1972-1978)", url: "/exhibits/zoom", thumbnail: "https://..." },
      { title: "Protecting Places", url: "/exhibits/places", thumbnail: "https://..." },
      { title: "Another Exhibit", url: "/exhibits/other", thumbnail: "https://..." },
      { title: "Fifth Item", url: "/exhibits/fifth", thumbnail: "https://..." },
  ];

  return {
    key_events: key_events,
    culture: culture,
    innovation: innovation,
    southwest: southwest,
    northwest: northwest,
    midwest: midwest,
    northeast: northeast,
    southeast: southeast,
  }
}

export default function America250() {
  let data = useLoaderData()
  
  return (
    <div className="body-container">
      <h1>Celebrating 250 Years of American Stories</h1>
      <p>
        As the United States marks its 250th anniversary, the American Archive of Public Broadcasting (AAPB) invites you to explore the voices, events, and moments that have shaped the nation. Through historic broadcasts, firsthand accounts, and cultural reflections, this collection offers a unique window into America's past - its struggles, triumphs, and evolving identity.
      </p>
      <p>From groundbreaking political moments to the everyday experiences of communities across the country, these programs capture the spirit of the nation as told through public media organizations from the 1950s to today. Discover the stories that define America - then, now, and for the future.</p>

      <div className="welcome-video-container">
        <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479"></iframe>
      </div>
      <hr />
      <Carousel title="Key Historical Events" items={ data.key_events } />
      <Carousel title="Culture" items={ data.culture } />
      <Carousel title="Innovation" items={ data.innovation } />
      <Carousel title="Regional Content (Southwest)" items={ data.southwest } />
      <Carousel title="Regional Content (Northwest)" items={ data.northwest } />
      <Carousel title="Regional Content (Midwest)" items={ data.midwest } />
      <Carousel title="Regional Content (Northeast)" items={ data.northeast } />
      <Carousel title="Regional Content (Southeast)" items={ data.southeast } />
    </div>
  )
}