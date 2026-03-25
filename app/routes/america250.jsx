import { useLoaderData } from 'react-router'
// import shuffle from '~/utils/shuffle'
import TVMenu from "../components/TVMenu"
import SummaryBox from "../components/SummaryBox"
import Carousel from '../components/Carousel';
import randomRecords from '../utils/randomRecords';
import randomThumb from '../utils/randomThumb';

export const loader = async () => {
    let records = await randomRecords(10)
    let programs = []
    if (records) {
        programs = records.map((record) => recordToTVProgram(record))
    }

    let data = {
        featured_collections: [
            {
                title: "first things first",
                subtitle: "giuseppe open toe",
                thumbnailURL: randomThumb(),
                url: "google.com"
            },
            {
                title: "go back for seconds",
                subtitle: "round too",
                thumbnailURL: randomThumb(),
                url: "google.com"
            },
            {
                title: "third wheels motor club",
                subtitle: "vroom vroom",
                thumbnailURL: randomThumb(),
                url: "google.com"
            },
        ],

        radio_and_tv: programs

    }

    return data
}

export default function Index() {
    let data = useLoaderData()
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
    return (
        <div className="body-container">
            <h1>Celebrating 250 Years of American Stories</h1>
            <p>As the United States marks its 250th anniversary, the American Archive of Public Broadcasting (AAPB) invites you to
                    explore the voices, events, and moments that have shaped the nation. Through historic broadcasts, firsthand accounts, and
                    cultural reflections, this collection offers a unique window into America's past - its struggles, triumphs, and evolving
                    identity.</p>
            <p>From groundbreaking political moments to the everyday experiences of communities across the country, these programs capture the spirit of the nation as told through public media organizations from the 1950s to today. Discover the stories that define America - then, now, and for the future.</p>

            <div className="welcome-video-container">
                <iframe src="https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479" style={{ width: '85%', border: 'none' }}></iframe>
            </div>
            <hr />
            <Carousel title="Key Historical Events" items={key_events} />
            <Carousel title="Culture" items={culture} />
            <Carousel title="Innovation" items={innovation} />
            <Carousel title="Regional Content (Southwest)" items={southwest} />
            <Carousel title="Regional Content (Northwest)" items={northwest} />
            <Carousel title="Regional Content (Midwest)" items={midwest} />
            <Carousel title="Regional Content (Northeast)" items={northeast} />
            <Carousel title="Regional Content (Southeast)" items={southeast} />
        </div>
    )
}