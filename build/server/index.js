import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, useLoaderData, useSearchParams } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ChevronDown, Search as Search$1, ChevronUp, ExternalLink, CircleCheckBig } from "lucide-react";
import { useState, useEffect } from "react";
import Searchkit from "searchkit";
import { InstantSearch, Stats, SortBy, CurrentRefinements, ClearRefinements, SearchBox, RefinementList, Hits, Pagination } from "react-instantsearch";
import Client from "@searchkit/instantsearch-client";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function DrawerMenu(props) {
  let items;
  if (props.items) {
    items = props.items.map((item, index) => {
      return /* @__PURE__ */ jsx(
        DrawerItem,
        {
          label: item.label,
          subLabel: item.subLabel,
          url: item.url,
          last: index == props.items.length - 1,
          external: item.external
        },
        index
      );
    });
  }
  let drawerClasses = "drawermenu-container ";
  if (props.classes) {
    drawerClasses += props.classes;
  }
  return /* @__PURE__ */ jsxs("div", { className: drawerClasses, children: [
    /* @__PURE__ */ jsxs("span", { className: "drawermenu-label", children: [
      props.label,
      /* @__PURE__ */ jsx(ChevronDown, {})
    ] }),
    /* @__PURE__ */ jsx("div", { className: "drawermenu-items", children: items })
  ] });
}
const DrawerItem = (props) => {
  if (props.last) ;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      className: "drawer-item",
      href: props.url,
      ...props.external ? { target: "_blank" } : {},
      children: [
        /* @__PURE__ */ jsx("h4", { className: "drawer-title", children: props.label }),
        /* @__PURE__ */ jsx("div", { className: "drawer-subtitle", children: props.subLabel })
      ]
    }
  );
};
function LayoutSearch(props) {
  const [search, setSearch] = useState(null);
  function goToSearch() {
    window.location.href = `/search?${props.indexName}[query]=${search}`;
  }
  function handleEnter(e) {
    if (e.key == "Enter") {
      goToSearch();
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "layout-search", children: [
    /* @__PURE__ */ jsx("input", { onKeyUp: (e) => handleEnter(e), onChange: (e) => setSearch(e.target.value), type: "text", name: "query", placeholder: "Search the Archive" }),
    /* @__PURE__ */ jsx("button", { onClick: goToSearch, children: /* @__PURE__ */ jsx(Search$1, { size: 16 }) })
  ] });
}
const drawerItems = {
  explore: [
    {
      label: "Collections",
      url: "/collections",
      external: false
    },
    {
      label: "Scholarly Exhibits",
      url: "/exhibits",
      external: false
    },
    {
      label: "Educator Resources",
      url: "/resources",
      external: false
    }
  ],
  participate: [
    {
      label: "Contribute Content",
      url: "/contribute",
      external: false
    },
    {
      label: "Volunteer",
      url: "/volunteer",
      external: false
    },
    {
      label: "Fix Transcripts",
      url: "/fixitplus",
      external: false
    }
  ],
  about: [
    {
      label: "About the AAPB",
      url: "/about",
      external: false
    },
    {
      label: "Participating Organizations",
      url: "/organizations",
      external: false
    },
    {
      label: "Visit",
      url: "/visit",
      external: false
    },
    {
      label: "FAQ",
      url: "/faq",
      external: false
    }
  ]
};
function Header(props) {
  return /* @__PURE__ */ jsxs("div", { className: "header-bar", children: [
    /* @__PURE__ */ jsx("a", { href: "/", children: /* @__PURE__ */ jsx("img", { src: "/aapb.png", className: "header-logo" }) }),
    /* @__PURE__ */ jsx("div", { className: "header-spacer" }),
    /* @__PURE__ */ jsx(DrawerMenu, { label: "Explore", items: drawerItems.explore }),
    /* @__PURE__ */ jsx(DrawerMenu, { label: "Participate", items: drawerItems.participate }),
    /* @__PURE__ */ jsx(DrawerMenu, { label: "About", items: drawerItems.about }),
    /* @__PURE__ */ jsx(LayoutSearch, {})
  ] });
}
function DonateButton(props) {
  return /* @__PURE__ */ jsx("a", { href: "/donate", children: /* @__PURE__ */ jsx("button", { className: "donate", children: "Donate" }) });
}
function NewsletterBar(props) {
  const [email, setEmail] = useState(null);
  function goToSubscribe() {
    window.location.href = `/subscribe?email=${email}`;
  }
  return /* @__PURE__ */ jsxs("div", { className: "newsletter-bar", children: [
    /* @__PURE__ */ jsx("div", { children: "Join the AAPB mailing list." }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("input", { onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email address", type: "text" }),
      /* @__PURE__ */ jsx("input", { onClick: goToSubscribe, type: "submit", value: "Subscribe" })
    ] })
  ] });
}
function SocialIcon(props) {
  return /* @__PURE__ */ jsx("div", { className: "social-icon", children: /* @__PURE__ */ jsx("img", { src: props.icon }) });
}
function ToeNail(props) {
  return /* @__PURE__ */ jsxs("div", { className: "toenail-bar", children: [
    /* @__PURE__ */ jsxs("div", { className: "toenail-logos", children: [
      "A collaboration:",
      /* @__PURE__ */ jsx("img", { src: "/gbh.png" }),
      /* @__PURE__ */ jsx("img", { src: "/loc.png" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "toenail-socials", children: [
      /* @__PURE__ */ jsx(SocialIcon, { icon: "/silly.png" }),
      /* @__PURE__ */ jsx(SocialIcon, { icon: "/silly.png" }),
      /* @__PURE__ */ jsx(SocialIcon, { icon: "/silly.png" }),
      /* @__PURE__ */ jsx(SocialIcon, { icon: "/silly.png" }),
      /* @__PURE__ */ jsx(SocialIcon, { icon: "/silly.png" })
    ] })
  ] });
}
function Footer(props) {
  let linkData = {
    explore: {
      title: "EXPLORE",
      titleURL: "/explore",
      links: [
        {
          url: "/collections",
          text: "Collections"
        },
        {
          url: "/exhibits",
          text: "Scholarly Exhibits"
        },
        {
          url: "/resources",
          text: "Educator Resources"
        }
      ]
    },
    participate: {
      title: "PARTICIPATE",
      titleURL: "/participate",
      links: [
        {
          url: "/contribute",
          text: "Contribute Content"
        },
        {
          url: "/volunteer",
          text: "Vounteer"
        },
        {
          url: "/fixitplus",
          text: "Fix Transcripts"
        }
      ]
    },
    about: {
      title: "ABOUT",
      titleURL: "/about",
      links: [
        {
          url: "/about",
          text: "About the AAPB"
        },
        {
          url: "/visit",
          text: "Visit"
        },
        {
          url: "/faq",
          text: "FAQ"
        },
        {
          url: "/contact",
          text: "Contact Us"
        }
      ]
    },
    last: {
      title: null,
      titleURL: null,
      links: [
        {
          url: "/blog",
          text: "Blog"
        },
        {
          url: "/feedback",
          text: "Feedback"
        },
        {
          url: "/content",
          text: "Content Statement"
        },
        {
          url: "/terms",
          text: "Terms of Use"
        },
        {
          url: "/privacy",
          text: "Privacy Policy"
        }
      ]
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "footer-bar", children: [
      /* @__PURE__ */ jsx(FooterLinks, { title: linkData.explore.title, titleURL: linkData.explore.titleURL, links: linkData.explore.links }),
      /* @__PURE__ */ jsx(FooterLinks, { title: linkData.participate.title, titleURL: linkData.participate.titleURL, links: linkData.participate.links }),
      /* @__PURE__ */ jsx(FooterLinks, { title: linkData.about.title, titleURL: linkData.about.titleURL, links: linkData.about.links }),
      /* @__PURE__ */ jsx(FooterLinks, { links: linkData.last.links }),
      /* @__PURE__ */ jsxs("div", { className: "footer-branding", children: [
        /* @__PURE__ */ jsx("img", { src: "/aapb.png" }),
        /* @__PURE__ */ jsx(DonateButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsx(NewsletterBar, {}),
    /* @__PURE__ */ jsx(ToeNail, {})
  ] });
}
function FooterLinks(props) {
  let links;
  if (props.links) {
    links = props.links.map((link, i) => {
      return /* @__PURE__ */ jsx("a", { className: "footer-link", href: link.url, children: link.text }, i);
    });
  }
  let titleBlock;
  if (props.title) {
    titleBlock = /* @__PURE__ */ jsx("a", { href: props.titleURL, children: /* @__PURE__ */ jsx("div", { className: "footer-title", children: props.title }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "footer-stack", children: [
    titleBlock,
    links
  ] });
}
function App() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "icon",
          href: "data:image/x-icon;base64,AA"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
function ScoreLight(props) {
  let color = "#ddd";
  let score = parseFloat(props.score);
  if (score) {
    if (score > 1 && score < 9) {
      color = "#ffa";
    } else if (score >= 9) {
      color = "#afa";
    }
  }
  return /* @__PURE__ */ jsx("div", { style: { backgroundColor: color }, className: "score-light" });
}
function thumbnailURL(guid) {
  return `https://s3.us-east-1.amazonaws.com/americanarchive.org/thumbnail/${guid}.jpg`;
}
function Thumbnail(props) {
  const [exists, setExists] = useState(false);
  var url = thumbnailURL(props.guid);
  var classes = props.searchResult ? "hit-thumbnail" : "show-thumbnail";
  var img;
  if (exists) {
    img = /* @__PURE__ */ jsx("img", { crossOrigin: "anonymous", src: url });
  } else {
    img = /* @__PURE__ */ jsx("img", { src: "/VIDEO.png" });
  }
  useEffect(() => {
    fetch(url, { method: "HEAD", headers: { "Referer": "http://18.235.155.36:4000" } }).then((resp) => setExists(resp.ok)).catch((err) => setExists(null));
  });
  return /* @__PURE__ */ jsx("div", { className: classes, children: img });
}
function niceTitle(titles) {
  if (!titles || titles.length == 0) {
    return `Untitled Record`;
  }
  var displayTitles;
  var seriesTitles = titles.filter((titleNode) => titleNode.titleType == "Series").map((node) => node.text);
  var episodeTitles = titles.filter((titleNode) => titleNode.titleType == "Episode").map((node) => node.text);
  var episodeNumbers = titles.filter((titleNode) => titleNode.titleType == "Episode Number").map((node) => node.text);
  if (seriesTitles.length > 1 && episodeNumbers.length > 0 && episodeTitles.length > 0) {
    displayTitles = episodeTitles;
  } else if (episodeNumbers.length > 1 && seriesTitles.length == 1 && episodeTitles.length > 0) {
    displayTitles = seriesTitles.concat(episodeTitles);
  } else {
    var alternativeTitles = titles.filter((titleNode) => titleNode.titleType == "Alternative").map((node) => node.text);
    if (alternativeTitles && alternativeTitles.length == titles.length) {
      displayTitles = alternativeTitles.map((titleNode) => titleNode.text);
    } else {
      displayTitles = titles.map((titleNode) => {
        if (titleNode.titleType != "Alternative") {
          return titleNode.text;
        }
      });
    }
  }
  return displayTitles.join("; ");
}
function aapbGuid(descdoc) {
  if (descdoc && descdoc.pbcoreIdentifier && descdoc.pbcoreIdentifier.length > 0) {
    var guidNode = descdoc.pbcoreIdentifier.find((pbcoreId) => pbcoreId.source == "http://americanarchiveinventory.org");
    if (guidNode && guidNode.text) {
      return guidNode.text.replace("/", "-");
    }
  }
}
function resultDescription(descriptions) {
  if (descriptions.length > 0 && descriptions[0].text && descriptions[0].text.toLowerCase() !== "no description available") {
    return `${descriptions[0].text.substring(0, 500)}`;
  } else {
    return "";
  }
}
function SearchResult({ hit }) {
  let guid = aapbGuid(hit.pbcoreDescriptionDocument);
  let description = resultDescription(hit.pbcoreDescriptionDocument.pbcoreDescription);
  let date, producingOrg;
  if (hit.pbcoreDescriptionDocument.assetDate && hit.pbcoreDescriptionDocument.assetDate.length > 0) {
    date = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("b", { children: "Date:" }),
      " ",
      hit.pbcoreDescriptionDocument.assetDate[0]
    ] });
  }
  if (hit.pbcoreDescriptionDocument.pbcoreCreator && hit.pbcoreDescriptionDocument.pbcoreCreator.length > 0) {
    producingOrg = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("b", { children: "Produced By:" }),
      " ",
      hit.producing_org
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "search-result", children: [
    /* @__PURE__ */ jsx("pre", { children: JSON.stringify(hit) }),
    /* @__PURE__ */ jsx("a", { href: `/search/${guid}`, children: /* @__PURE__ */ jsx("div", { className: "hit-thumbnail-container", children: /* @__PURE__ */ jsx(Thumbnail, { guid, searchResult: true }) }) }),
    /* @__PURE__ */ jsx("div", { className: "hit-info-container", children: /* @__PURE__ */ jsx("h3", { className: "hit-title", children: /* @__PURE__ */ jsx("a", { href: `/search/${guid}`, children: hit.title }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "hit-details marbot", children: [
      /* @__PURE__ */ jsx(ScoreLight, { score: hit._score }),
      date,
      producingOrg
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hit-description marbot", children: description }),
    /* @__PURE__ */ jsx("hr", {})
  ] });
}
function SearchAccordion(props) {
  const [isOpen, setIsOpen] = useState(!props.startClosed);
  let classes = "search-accordion-content";
  if (isOpen) {
    classes = classes + " open";
  }
  let chevy;
  if (isOpen) {
    chevy = /* @__PURE__ */ jsx(ChevronDown, {});
  } else {
    chevy = /* @__PURE__ */ jsx(ChevronUp, {});
  }
  return /* @__PURE__ */ jsxs("div", { className: "search-accordion-container", children: [
    /* @__PURE__ */ jsx("div", { onClick: () => {
      setIsOpen(!isOpen);
    }, className: "search-accordion-toggle", children: /* @__PURE__ */ jsxs("h4", { className: "search-accordion-title", children: [
      props.title,
      chevy
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: classes, children: props.content })
  ] });
}
const loader$4 = async ({ params, request }) => {
  return {
    indexName: process.env.ES_INDEX_NAME || "aapb_augmented_biggram",
    apiKey: process.env.ES_API_KEY,
    esURL: process.env.ES_URL
  };
};
function Search() {
  const data = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [customQuery, setCustomQuery] = useState({
    all: searchParams.get("all") || "",
    title: searchParams.get("title") || "",
    none: searchParams.get("none") || ""
  });
  const [showingRefinements, setShowingRefinements] = useState(false);
  let currentRefinementsClasses, showRefinementButtonText;
  if (!showingRefinements) {
    currentRefinementsClasses = "current-refinements-container closed";
    showRefinementButtonText = "Show More";
  } else {
    currentRefinementsClasses = "current-refinements-container";
    showRefinementButtonText = "Show Less";
  }
  function titleQuery(tQuery) {
    return {
      bool: {
        should: [
          {
            match: {
              "title": tQuery
            }
          },
          {
            nested: {
              path: "pbcoreDescriptionDocument.pbcoreTitle",
              query: {
                match: {
                  "pbcoreDescriptionDocument.pbcoreTitle.text": {
                    query: tQuery
                  }
                }
              }
            }
          }
        ],
        minimum_should_match: 1
      }
    };
  }
  function allFieldsArray(query) {
    return [
      // simplified syntax that works but omits options
      {
        match: {
          "guid": query
        }
      },
      {
        match: {
          "genres": query
        }
      },
      {
        match: {
          "topics": query
        }
      },
      //full syntax w options
      {
        match: {
          title: {
            query,
            analyzer: "standard",
            boost: 4
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreDescription",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreDescription.text": {
                query
              }
            }
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreTitle",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreTitle.text": {
                query,
                analyzer: "standard",
                boost: 3
              }
            }
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreAssetDate",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreAssetDate.text": {
                query
              }
            }
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreCreator.creator",
          query: {
            match: {
              "pbcoreDescriptionDocument.pbcoreCreator.creator.text": {
                query,
                boost: 1
              }
            }
          }
        }
      }
    ];
  }
  function allFieldsTermArray(query) {
    return [
      {
        term: {
          guid: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        term: {
          genres: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        term: {
          topics: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        term: {
          title: {
            value: query,
            case_insensitive: true
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreDescription",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreDescription.text": {
                value: query,
                case_insensitive: true
              }
            }
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreTitle",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreTitle.text": {
                value: query,
                case_insensitive: true
              }
            }
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreAssetDate",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreAssetDate.text": {
                value: query
              }
            }
          }
        }
      },
      {
        nested: {
          path: "pbcoreDescriptionDocument.pbcoreCreator.creator",
          query: {
            term: {
              "pbcoreDescriptionDocument.pbcoreCreator.creator.text": {
                value: query,
                case_insensitive: true
              }
            }
          }
        }
      }
    ];
  }
  function allFieldsTermQuery(query) {
    var nested_clauses = query.split(" ").map((q) => allFieldsTermArray(q)).flat();
    return {
      bool: {
        // this is admittedly just crazy
        should: nested_clauses,
        // this is for must_not, any match fails!
        minimum_should_match: 1
      }
    };
  }
  const sk = new Searchkit({
    connection: {
      host: data.esURL,
      apiKey: data.apiKey
    },
    search_settings: {
      highlight_attributes: ["pbcoreDescriptionDocument.pbcoreTitle.text"],
      search_attributes: [
        // "guid",
        // "genres"
        // "pbcoreDescriptionDocument.pbcoreDescription",
        // "pbcoreDescriptionDocument.pbcoreTitle.text",
        // { field: "pbcoreDescriptionDocument.pbcoreTitle.text", weight: 5 },
        // { field: "pbcoreDescriptionDocument.pbcoreCreator", weight: 2 }
        // "pbcoreDescriptionDocument.pbcoreAnnotation.first.text",
        // "pbcoreDescriptionDocument.pbcoreIdentifier",
      ],
      // WHAT FIELDS ARE INCLUDED IN RETURNED HIT
      result_attributes: ["guid", "title", "broadcast_date", "pbcoreDescriptionDocument"],
      facet_attributes: [
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.text", 
        //   field: "text", 
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        // },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation.annotationType.text",
        //   field: "text", 
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreInstantiation.instantiationAnnotation"
        // },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreAssetDate.text", 
        //   field: "text",
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreAssetDate"
        // },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreGenre.text", 
        //   field: "text",
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreGenre"
        // },
        {
          attribute: "pbcoreDescriptionDocument.pbcoreAssetType.text",
          field: "text",
          type: "string",
          nestedPath: "pbcoreDescriptionDocument.pbcoreAssetType"
        },
        // { 
        //   attribute: "pbcoreDescriptionDocument.pbcoreDescription.text", 
        //   field: "text",
        //   type: "string",
        //   nestedPath: "pbcoreDescriptionDocument.pbcoreDescription"
        // },        
        // derived
        {
          attribute: "producing_org",
          field: "producing_org",
          type: "string"
        },
        {
          attribute: "media_type",
          field: "media_type",
          type: "string"
        },
        {
          attribute: "access_level",
          field: "access_level",
          type: "string"
        },
        {
          attribute: "genres",
          field: "genres",
          type: "string"
        },
        {
          attribute: "contributing_orgs",
          field: "contributing_orgs",
          type: "string"
        },
        {
          attribute: "special_collections",
          field: "special_collections",
          type: "string"
        },
        {
          attribute: "topics",
          field: "topics",
          type: "string"
        },
        {
          attribute: "broadcast_date",
          field: "broadcast_date",
          type: "string"
        }
      ],
      sorting: {
        _default: {
          field: "_score",
          order: "desc"
        },
        _title_keyword_asc: {
          field: "title_keyword",
          order: "asc"
        },
        _broadcast_date_desc: {
          field: "broadcast_date",
          order: "desc"
        }
      }
    }
  });
  const accessLevel = (items) => {
    return items.map((item) => {
      if (!item.label) {
        item.label = "Private";
      }
      return item;
    });
  };
  const prettyFieldNames = (fieldName) => {
    switch (fieldName) {
      case "producing_org":
        return "Producing Organization";
      case "contributing_orgs":
        return "Contributing Organization";
      case "media_type":
        return "Media Type";
      case "access_level":
        return "Availability";
      case "genres":
        return "Genre";
      case "topics":
        return "Topic";
      case "pbcoreDescriptionDocument.pbcoreAssetType.text":
        return "Asset Type";
      case "collections":
        return "Collection";
    }
  };
  const prettyCurrentRefinements = (attributes) => {
    attributes.map((attribute) => {
      let refs = attribute.refinements.map((ref) => {
        ref.label = `${prettyFieldNames(attribute.label)}: ${ref.label}`;
        return ref;
      });
      attribute.label = "";
      attribute.refinements = refs;
      return attribute;
    });
    return attributes;
  };
  const searchClient = Client(sk, {
    getQuery: (query, search_attributes) => {
      var queryHash;
      if (customQuery.title && customQuery.title.length > 0) {
        customQuery.title;
      }
      {
        var mainAllFieldsArray;
        {
          mainAllFieldsArray = allFieldsArray(query);
        }
        queryHash = {
          // top bool
          bool: {
            // big should
            should: [
              {
                bool: {
                  should: mainAllFieldsArray,
                  minimum_should_match: 1
                }
              }
            ]
          }
        };
        if (customQuery.all && customQuery.all.length > 0) {
          var allQuery = {
            bool: {
              should: allFieldsArray(customQuery.all)
            }
          };
          queryHash.bool.should.push(allQuery);
          queryHash.bool.minimum_should_match = 2;
        }
        if (customQuery.none && customQuery.none.length > 0) {
          queryHash.bool.must_not = [allFieldsTermQuery(customQuery.none)];
        }
        if (customQuery.title && customQuery.title.length > 0) {
          queryHash.bool.must = [titleQuery(customQuery.title)];
        }
        return queryHash;
      }
    }
  });
  return /* @__PURE__ */ jsx("div", { className: "body-container", children: /* @__PURE__ */ jsxs(
    InstantSearch,
    {
      routing: true,
      indexName: data.indexName,
      searchClient,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "top-search-bar marleft marbot", children: [
          /* @__PURE__ */ jsx("h2", { className: "", children: "Search Results" }),
          /* @__PURE__ */ jsx(Stats, {})
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "top-refinements-bar marbot marleft marright", children: [
          /* @__PURE__ */ jsx("div", { className: "sort-container", children: /* @__PURE__ */ jsx(
            SortBy,
            {
              items: [
                { key: "sort1", label: "Relevance", value: "aapb_augmented_biggram_default" },
                { key: "sort2", label: "Title", value: "aapb_augmented_biggram_title_keyword_asc" },
                { key: "sort3", label: "Broadcast Date", value: "aapb_augmented_biggram_broadcast_date_desc" }
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: currentRefinementsClasses, children: /* @__PURE__ */ jsx(
            CurrentRefinements,
            {
              transformItems: prettyCurrentRefinements
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "clear-refinements-container", children: [
            /* @__PURE__ */ jsx(ClearRefinements, {}),
            /* @__PURE__ */ jsx("div", { className: "more-refinements", children: /* @__PURE__ */ jsx("button", { onClick: () => {
              setShowingRefinements(!showingRefinements);
            }, children: showRefinementButtonText }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "page-sidebar", children: [
          /* @__PURE__ */ jsx("h3", { children: "Refine Search" }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Keywords", content: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("h4", { children: "Search for" }),
            /* @__PURE__ */ jsx(SearchBox, { className: "sidebar-search smarbot" }),
            /* @__PURE__ */ jsx("h4", { children: "Contains all these words" }),
            /* @__PURE__ */ jsx("input", { value: customQuery.all, className: "sidebar-search smarbot", type: "text", onChange: (e) => setCustomQuery({ ...customQuery, all: e.target.value }) }),
            /* @__PURE__ */ jsx("h4", { children: "This title" }),
            /* @__PURE__ */ jsx("input", { value: customQuery.title, className: "sidebar-search smarbot", type: "text", onChange: (e) => setCustomQuery({ ...customQuery, title: e.target.value }) }),
            /* @__PURE__ */ jsx("h4", { children: "None of these words" }),
            /* @__PURE__ */ jsx("input", { value: customQuery.none, className: "sidebar-search smarbot", type: "text", onChange: (e) => setCustomQuery({ ...customQuery, none: e.target.value }) })
          ] }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Availability", content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "access_level",
              transformItems: accessLevel
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Media Type", content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "media_type"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Asset Type", startClosed: true, content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "pbcoreDescriptionDocument.pbcoreAssetType.text"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Producing Organization", content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "producing_org"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Genre", startClosed: true, content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "genres"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Topic", startClosed: true, content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "topics"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Contributing Organization", startClosed: true, content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "contributing_orgs"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {}),
          /* @__PURE__ */ jsx(SearchAccordion, { title: "Collection", startClosed: true, content: /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
            RefinementList,
            {
              attribute: "special_collections"
            }
          ) }) }),
          /* @__PURE__ */ jsx("hr", {})
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "page-maincolumn", children: [
          /* @__PURE__ */ jsx(Hits, { hitComponent: SearchResult }),
          /* @__PURE__ */ jsx(Pagination, {})
        ] })
      ]
    }
  ) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Search,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function VideoPlayer(props) {
  {
    return (
      //poster={ thumbnailURL(props.guid) }
      /* @__PURE__ */ jsx("div", { className: "video-player-container", children: /* @__PURE__ */ jsx("video", { controls: true, preload: "auto", children: /* @__PURE__ */ jsx("source", { src: "/A_Colour_Box_512kb.mp4" }) }) })
    );
  }
}
function HeaderBar(props) {
  return /* @__PURE__ */ jsx("div", { className: "show-header-bar", children: /* @__PURE__ */ jsxs("div", { className: "show-title", children: [
    /* @__PURE__ */ jsx("h2", { children: props.title }),
    /* @__PURE__ */ jsx("hr", {})
  ] }) });
}
function ShowBox(props) {
  return /* @__PURE__ */ jsxs("div", { className: "show-box", children: [
    /* @__PURE__ */ jsx("label", { children: props.label }),
    props.text
  ] });
}
async function getRecord(guid) {
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX_NAME}/_search`;
  var response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${process.env.ES_API_KEY}` },
    body: JSON.stringify({ "query": { "match_phrase": { "guid": guid } } })
  });
  var data = await response.json();
  if (data && data.hits && data.hits.hits && data.hits.hits[0] && data.hits.hits[0]._source) {
    return data.hits.hits[0]._source;
  }
}
const loader$3 = async ({ params, request }) => {
  let data = await getRecord(params.guid);
  if (data) {
    return data;
  } else {
    return null;
  }
};
function ShowRecord() {
  var _a, _b;
  const data = useLoaderData();
  let people, orgs, identifiers;
  let title, description, mediaType, eachId, producingOrg, creators, coverages;
  if (data) {
    title = niceTitle(data.pbcoreDescriptionDocument.pbcoreTitle);
    if ((_a = data == null ? void 0 : data.pbcoreDescriptionDocument) == null ? void 0 : _a.pbcoreDescription[0]) {
      if ((_b = data.pbcoreDescriptionDocument.pbcoreDescription[0]) == null ? void 0 : _b.text) {
        description = data.pbcoreDescriptionDocument.pbcoreDescription[0].text;
      } else {
        description = "No Description Available";
      }
      description = /* @__PURE__ */ jsx(ShowBox, { label: "Description", text: description });
    }
    if (data.media_type) {
      mediaType = /* @__PURE__ */ jsx(ShowBox, { label: "Media Type", text: data.media_type });
    }
    if (data.producing_org) {
      producingOrg = /* @__PURE__ */ jsx(ShowBox, { label: "Producing Organization", text: data.producing_org });
    }
    if (producingOrg) {
      orgs = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "show-metadata-header", children: "Organizations" }),
        producingOrg
      ] });
    }
    if (data.pbcoreDescriptionDocument.pbcoreCreator && data.pbcoreDescriptionDocument.pbcoreCreator.length > 0) {
      creators = data.pbcoreDescriptionDocument.pbcoreCreator.map((pbc) => {
        if (pbc.creator && pbc.creatorRole && pbc.creatorRole.text && pbc.creatorRole.text != "Producing Organization") {
          return /* @__PURE__ */ jsx(ShowBox, { label: pbc.creatorRole.text, text: pbc.creator.text });
        }
      });
      creators = creators.filter((cre) => cre != void 0);
      creators = creators.join("\n");
    }
    if (creators) {
      people = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "show-metadata-header", children: "People" }),
        creators
      ] });
    }
    if (data.pbcoreDescriptionDocument.pbcoreCoverage && data.pbcoreDescriptionDocument.pbcoreCoverage.length > 0) {
      coverages = data.pbcoreDescriptionDocument.pbcoreCoverage.map((pbc) => {
        if (pbc.creatorRole && pbc.creatorRole.text != "Producing Organization") {
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "show-metadata-header", children: "Locations" }),
            /* @__PURE__ */ jsx(ShowBox, { label: pbc.coverageType.text, text: pbc.coverage.text })
          ] });
        }
      });
    }
    if (data.pbcoreDescriptionDocument.pbcoreIdentifier && data.pbcoreDescriptionDocument.pbcoreIdentifier.length > 0) {
      eachId = data.pbcoreDescriptionDocument.pbcoreIdentifier.map((pbi) => {
        return /* @__PURE__ */ jsx(ShowBox, { label: pbi.source || "Unknown ID", text: pbi.text });
      });
    }
    if (eachId.length > 0) {
      identifiers = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "show-metadata-header", children: "Identifiers" }),
        eachId
      ] });
    }
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "skinny-body-container", children: [
    /* @__PURE__ */ jsx(HeaderBar, { title }),
    /* @__PURE__ */ jsx("pre", { style: { fontSize: "10px", display: "none" }, children: JSON.stringify(data, null, 20) }),
    /* @__PURE__ */ jsx("div", { className: "body-container", children: /* @__PURE__ */ jsx("div", { className: "show-media", children: /* @__PURE__ */ jsx(VideoPlayer, { guid: data.guid }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "show-metadata-container", children: [
      /* @__PURE__ */ jsx("div", { className: "show-metadata-header", children: "Info" }),
      mediaType,
      description,
      orgs,
      identifiers,
      people,
      coverages
    ] })
  ] }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ShowRecord,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function TVMenu(props) {
  let programs = props.programs;
  if (props.programs) {
    if (programs.length == 3) {
      programs = programs.map((program) => {
        program.classes = " three";
        return program;
      });
    }
    programs = programs.map((program) => TVProgram(program));
  }
  let seeAll;
  if (props.seeAllURL) {
    seeAll = /* @__PURE__ */ jsx("a", { className: "see-all", href: props.seeAllURL, children: "See All" });
  }
  let classes = "tv-menu-container";
  if (programs.length == 3) {
    classes += " three";
  }
  return /* @__PURE__ */ jsxs("div", { className: classes, children: [
    seeAll,
    /* @__PURE__ */ jsxs("div", { className: "tv-menu-body", children: [
      /* @__PURE__ */ jsx("h2", { children: props.title }),
      programs
    ] })
  ] });
}
function TVProgram(props) {
  return /* @__PURE__ */ jsx("div", { className: "tv-menu-program" + (props.classes ? props.classes : ""), children: /* @__PURE__ */ jsxs("a", { href: props.url, children: [
    /* @__PURE__ */ jsx(Thumbnail, { url: props.thumbnail }),
    /* @__PURE__ */ jsx("h4", { children: props.title }),
    /* @__PURE__ */ jsx("h5", { children: props.subtitle })
  ] }) }, props.key);
}
function SummaryBox(props) {
  let title;
  if (props.title && props.title.length > 0) {
    title = /* @__PURE__ */ jsx("h2", { children: props.title });
  }
  return /* @__PURE__ */ jsxs("div", { className: "summary-box-container", children: [
    title,
    /* @__PURE__ */ jsx("div", { className: "summary-box", children: props.text })
  ] });
}
function randomThumb() {
  return `/thumbs/${filenames[Math.floor(Math.random() * filenames.length)]}`;
}
const filenames = [
  "0-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "0-cpb-aacip-111-56n033jj.jpg",
  "0-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "0-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "0-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "0-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "0-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "0-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "0-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "0-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "1-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "1-cpb-aacip-111-56n033jj.jpg",
  "1-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "1-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "1-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "1-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "1-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "1-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "1-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "1-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "10-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "10-cpb-aacip-111-56n033jj.jpg",
  "10-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "10-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "10-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "10-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "10-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "10-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "10-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "10-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "11-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "11-cpb-aacip-111-56n033jj.jpg",
  "11-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "11-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "11-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "11-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "11-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "11-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "11-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "11-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "12-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "12-cpb-aacip-111-56n033jj.jpg",
  "12-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "12-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "12-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "12-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "12-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "12-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "12-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "12-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "13-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "13-cpb-aacip-111-56n033jj.jpg",
  "13-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "13-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "13-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "13-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "13-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "13-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "13-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "13-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "14-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "14-cpb-aacip-111-56n033jj.jpg",
  "14-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "14-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "14-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "14-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "14-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "14-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "14-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "14-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "15-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "15-cpb-aacip-111-56n033jj.jpg",
  "15-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "15-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "15-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "15-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "15-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "15-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "15-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "15-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "16-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "16-cpb-aacip-111-56n033jj.jpg",
  "16-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "16-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "16-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "16-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "16-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "16-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "16-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "16-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "17-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "17-cpb-aacip-111-56n033jj.jpg",
  "17-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "17-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "17-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "17-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "17-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "17-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "17-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "17-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "18-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "18-cpb-aacip-111-56n033jj.jpg",
  "18-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "18-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "18-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "18-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "18-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "18-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "18-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "18-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "19-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "19-cpb-aacip-111-56n033jj.jpg",
  "19-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "19-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "19-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "19-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "19-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "19-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "19-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "19-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "2-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "2-cpb-aacip-111-56n033jj.jpg",
  "2-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "2-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "2-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "2-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "2-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "2-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "2-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "2-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "20-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "20-cpb-aacip-111-56n033jj.jpg",
  "20-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "20-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "20-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "20-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "20-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "20-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "20-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "20-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "21-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "21-cpb-aacip-111-56n033jj.jpg",
  "21-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "21-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "21-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "21-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "21-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "21-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "21-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "21-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "22-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "22-cpb-aacip-111-56n033jj.jpg",
  "22-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "22-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "22-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "22-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "22-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "22-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "22-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "22-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "23-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "23-cpb-aacip-111-56n033jj.jpg",
  "23-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "23-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "23-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "23-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "23-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "23-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "23-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "23-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "24-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "24-cpb-aacip-111-56n033jj.jpg",
  "24-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "24-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "24-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "24-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "24-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "24-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "24-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "24-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "25-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "25-cpb-aacip-111-56n033jj.jpg",
  "25-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "25-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "25-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "25-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "25-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "25-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "25-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "25-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "26-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "26-cpb-aacip-111-56n033jj.jpg",
  "26-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "26-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "26-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "26-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "26-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "26-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "26-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "26-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "27-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "27-cpb-aacip-111-56n033jj.jpg",
  "27-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "27-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "27-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "27-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "27-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "27-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "27-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "27-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "28-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "28-cpb-aacip-111-56n033jj.jpg",
  "28-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "28-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "28-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "28-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "28-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "28-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "28-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "28-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "29-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "29-cpb-aacip-111-56n033jj.jpg",
  "29-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "29-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "29-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "29-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "29-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "29-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "29-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "29-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "3-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "3-cpb-aacip-111-56n033jj.jpg",
  "3-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "3-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "3-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "3-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "3-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "3-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "3-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "3-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "30-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "30-cpb-aacip-111-56n033jj.jpg",
  "30-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "30-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "30-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "30-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "30-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "30-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "30-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "30-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "31-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "31-cpb-aacip-111-56n033jj.jpg",
  "31-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "31-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "31-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "31-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "31-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "31-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "31-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "31-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "32-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "32-cpb-aacip-111-56n033jj.jpg",
  "32-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "32-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "32-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "32-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "32-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "32-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "32-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "32-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "33-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "33-cpb-aacip-111-56n033jj.jpg",
  "33-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "33-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "33-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "33-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "33-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "33-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "33-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "33-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "34-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "34-cpb-aacip-111-56n033jj.jpg",
  "34-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "34-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "34-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "34-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "34-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "34-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "34-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "34-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "35-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "35-cpb-aacip-111-56n033jj.jpg",
  "35-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "35-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "35-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "35-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "35-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "35-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "35-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "35-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "36-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "36-cpb-aacip-111-56n033jj.jpg",
  "36-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "36-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "36-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "36-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "36-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "36-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "36-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "36-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "37-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "37-cpb-aacip-111-56n033jj.jpg",
  "37-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "37-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "37-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "37-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "37-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "37-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "37-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "37-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "38-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "38-cpb-aacip-111-56n033jj.jpg",
  "38-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "38-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "38-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "38-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "38-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "38-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "38-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "38-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "39-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "39-cpb-aacip-111-56n033jj.jpg",
  "39-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "39-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "39-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "39-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "39-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "39-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "39-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "39-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "4-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "4-cpb-aacip-111-56n033jj.jpg",
  "4-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "4-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "4-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "4-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "4-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "4-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "4-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "4-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "40-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "40-cpb-aacip-111-56n033jj.jpg",
  "40-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "40-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "40-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "40-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "40-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "40-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "40-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "40-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "41-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "41-cpb-aacip-111-56n033jj.jpg",
  "41-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "41-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "41-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "41-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "41-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "41-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "41-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "41-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "42-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "42-cpb-aacip-111-56n033jj.jpg",
  "42-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "42-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "42-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "42-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "42-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "42-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "42-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "42-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "43-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "43-cpb-aacip-111-56n033jj.jpg",
  "43-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "43-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "43-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "43-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "43-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "43-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "43-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "43-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "44-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "44-cpb-aacip-111-56n033jj.jpg",
  "44-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "44-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "44-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "44-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "44-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "44-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "44-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "44-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "45-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "45-cpb-aacip-111-56n033jj.jpg",
  "45-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "45-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "45-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "45-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "45-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "45-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "45-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "45-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "46-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "46-cpb-aacip-111-56n033jj.jpg",
  "46-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "46-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "46-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "46-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "46-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "46-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "46-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "46-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "47-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "47-cpb-aacip-111-56n033jj.jpg",
  "47-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "47-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "47-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "47-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "47-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "47-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "47-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "47-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "48-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "48-cpb-aacip-111-56n033jj.jpg",
  "48-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "48-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "48-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "48-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "48-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "48-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "48-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "48-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "49-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "49-cpb-aacip-111-56n033jj.jpg",
  "49-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "49-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "49-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "49-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "49-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "49-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "49-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "49-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "5-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "5-cpb-aacip-111-56n033jj.jpg",
  "5-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "5-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "5-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "5-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "5-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "5-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "5-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "5-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "50-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "50-cpb-aacip-111-56n033jj.jpg",
  "50-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "50-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "50-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "50-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "50-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "50-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "50-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "50-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "51-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "51-cpb-aacip-111-56n033jj.jpg",
  "51-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "51-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "51-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "51-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "51-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "51-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "51-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "51-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "52-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "52-cpb-aacip-111-56n033jj.jpg",
  "52-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "52-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "52-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "52-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "52-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "52-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "52-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "52-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "53-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "53-cpb-aacip-111-56n033jj.jpg",
  "53-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "53-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "53-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "53-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "53-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "53-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "53-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "53-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "54-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "54-cpb-aacip-111-56n033jj.jpg",
  "54-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "54-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "54-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "54-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "54-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "54-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "54-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "54-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "55-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "55-cpb-aacip-111-56n033jj.jpg",
  "55-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "55-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "55-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "55-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "55-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "55-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "55-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "55-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "56-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "56-cpb-aacip-111-56n033jj.jpg",
  "56-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "56-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "56-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "56-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "56-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "56-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "56-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "56-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "57-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "57-cpb-aacip-111-56n033jj.jpg",
  "57-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "57-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "57-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "57-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "57-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "57-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "57-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "57-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "58-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "58-cpb-aacip-111-56n033jj.jpg",
  "58-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "58-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "58-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "58-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "58-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "58-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "58-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "58-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "59-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "59-cpb-aacip-111-56n033jj.jpg",
  "59-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "59-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "59-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "59-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "59-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "59-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "59-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "59-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "6-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "6-cpb-aacip-111-56n033jj.jpg",
  "6-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "6-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "6-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "6-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "6-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "6-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "6-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "6-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "60-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "60-cpb-aacip-111-56n033jj.jpg",
  "60-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "60-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "60-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "60-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "60-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "60-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "60-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "60-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "61-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "61-cpb-aacip-111-56n033jj.jpg",
  "61-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "61-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "61-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "61-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "61-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "61-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "61-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "61-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "62-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "62-cpb-aacip-111-56n033jj.jpg",
  "62-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "62-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "62-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "62-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "62-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "62-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "62-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "62-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "63-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "63-cpb-aacip-111-56n033jj.jpg",
  "63-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "63-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "63-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "63-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "63-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "63-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "63-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "63-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "64-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "64-cpb-aacip-111-56n033jj.jpg",
  "64-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "64-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "64-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "64-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "64-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "64-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "64-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "64-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "65-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "65-cpb-aacip-111-56n033jj.jpg",
  "65-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "65-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "65-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "65-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "65-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "65-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "65-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "65-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "66-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "66-cpb-aacip-111-56n033jj.jpg",
  "66-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "66-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "66-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "66-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "66-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "66-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "66-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "66-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "67-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "67-cpb-aacip-111-56n033jj.jpg",
  "67-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "67-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "67-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "67-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "67-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "67-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "67-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "67-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "68-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "68-cpb-aacip-111-56n033jj.jpg",
  "68-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "68-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "68-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "68-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "68-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "68-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "68-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "68-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "69-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "69-cpb-aacip-111-56n033jj.jpg",
  "69-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "69-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "69-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "69-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "69-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "69-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "69-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "69-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "7-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "7-cpb-aacip-111-56n033jj.jpg",
  "7-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "7-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "7-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "7-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "7-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "7-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "7-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "7-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "70-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "70-cpb-aacip-111-56n033jj.jpg",
  "70-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "70-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "70-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "70-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "70-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "70-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "70-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "70-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "71-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "71-cpb-aacip-111-56n033jj.jpg",
  "71-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "71-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "71-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "71-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "71-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "71-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "71-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "71-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "72-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "72-cpb-aacip-111-56n033jj.jpg",
  "72-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "72-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "72-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "72-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "72-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "72-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "72-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "72-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "73-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "73-cpb-aacip-111-56n033jj.jpg",
  "73-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "73-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "73-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "73-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "73-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "73-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "73-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "73-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "74-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "74-cpb-aacip-111-56n033jj.jpg",
  "74-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "74-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "74-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "74-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "74-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "74-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "74-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "74-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "75-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "75-cpb-aacip-111-56n033jj.jpg",
  "75-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "75-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "75-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "75-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "75-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "75-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "75-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "75-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "76-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "76-cpb-aacip-111-56n033jj.jpg",
  "76-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "76-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "76-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "76-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "76-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "76-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "76-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "76-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "77-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "77-cpb-aacip-111-56n033jj.jpg",
  "77-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "77-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "77-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "77-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "77-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "77-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "77-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "77-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "78-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "78-cpb-aacip-111-56n033jj.jpg",
  "78-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "78-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "78-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "78-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "78-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "78-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "78-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "78-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "79-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "79-cpb-aacip-111-56n033jj.jpg",
  "79-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "79-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "79-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "79-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "79-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "79-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "79-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "79-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "8-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "8-cpb-aacip-111-56n033jj.jpg",
  "8-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "8-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "8-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "8-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "8-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "8-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "8-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "8-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "80-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "80-cpb-aacip-111-56n033jj.jpg",
  "80-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "80-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "80-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "80-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "80-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "80-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "80-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "80-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "81-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "81-cpb-aacip-111-56n033jj.jpg",
  "81-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "81-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "81-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "81-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "81-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "81-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "81-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "81-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "82-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "82-cpb-aacip-111-56n033jj.jpg",
  "82-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "82-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "82-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "82-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "82-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "82-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "82-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "82-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "83-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "83-cpb-aacip-111-56n033jj.jpg",
  "83-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "83-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "83-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "83-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "83-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "83-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "83-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "83-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "84-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "84-cpb-aacip-111-56n033jj.jpg",
  "84-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "84-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "84-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "84-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "84-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "84-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "84-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "84-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "85-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "85-cpb-aacip-111-56n033jj.jpg",
  "85-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "85-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "85-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "85-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "85-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "85-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "85-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "85-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "86-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "86-cpb-aacip-111-56n033jj.jpg",
  "86-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "86-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "86-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "86-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "86-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "86-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "86-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "86-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "87-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "87-cpb-aacip-111-56n033jj.jpg",
  "87-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "87-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "87-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "87-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "87-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "87-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "87-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "87-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "88-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "88-cpb-aacip-111-56n033jj.jpg",
  "88-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "88-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "88-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "88-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "88-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "88-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "88-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "88-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "89-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "89-cpb-aacip-111-56n033jj.jpg",
  "89-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "89-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "89-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "89-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "89-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "89-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "89-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "89-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "9-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "9-cpb-aacip-111-56n033jj.jpg",
  "9-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "9-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "9-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "9-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "9-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "9-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "9-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "9-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "90-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "90-cpb-aacip-111-56n033jj.jpg",
  "90-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "90-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "90-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "90-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "90-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "90-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "90-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "90-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "91-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "91-cpb-aacip-111-56n033jj.jpg",
  "91-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "91-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "91-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "91-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "91-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "91-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "91-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "91-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "92-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "92-cpb-aacip-111-56n033jj.jpg",
  "92-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "92-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "92-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "92-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "92-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "92-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "92-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "92-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "93-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "93-cpb-aacip-111-56n033jj.jpg",
  "93-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "93-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "93-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "93-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "93-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "93-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "93-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "93-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "94-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "94-cpb-aacip-111-56n033jj.jpg",
  "94-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "94-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "94-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "94-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "94-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "94-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "94-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "94-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "95-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "95-cpb-aacip-111-56n033jj.jpg",
  "95-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "95-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "95-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "95-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "95-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "95-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "95-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "95-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "96-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "96-cpb-aacip-111-56n033jj.jpg",
  "96-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "96-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "96-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "96-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "96-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "96-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "96-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "96-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "97-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "97-cpb-aacip-111-56n033jj.jpg",
  "97-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "97-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "97-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "97-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "97-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "97-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "97-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "97-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "98-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "98-cpb-aacip-111-56n033jj.jpg",
  "98-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "98-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "98-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "98-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "98-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "98-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "98-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "98-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "99-cpb-aacip-031239687ee-3G_480x270p.jpg",
  "99-cpb-aacip-111-56n033jj.jpg",
  "99-cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "99-cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "99-cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "99-cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "99-cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "99-cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "99-cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "99-EAP4008_NellCarter_barcode257898-SD_480x360p.jpg",
  "cpb-aacip-031239687ee-3G_480x270p.jpg",
  "cpb-aacip-111-56n033jj.jpg",
  "cpb-aacip-15-30bvqkcg.h264-SD_480x360p.jpg",
  "cpb-aacip-249ace2fbfb-3G_368x270p.jpg",
  "cpb-aacip-30f1f523b90-3G_368x270p.jpg",
  "cpb-aacip-398-44pk0tm7.h264-3G_360x270p.jpg",
  "cpb-aacip-3ecdd4471e6-3G_360x270p.jpg",
  "cpb-aacip-85144e0b6d6-SD_640x360p.jpg",
  "cpb-aacip-f8010e8912b-3G_368x270p.jpg",
  "EAP4008_NellCarter_barcode257898-SD_480x360p.jpg"
];
const loader$2 = async () => {
  let data = {
    featured_collections: [
      {
        title: "first things first",
        subtitle: "giuseppe open toe",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        title: "go back for seconds",
        subtitle: "round too",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        title: "third wheels motor club",
        subtitle: "vroom vroom",
        thumbnail: randomThumb(),
        url: "google.com"
      }
    ],
    radio_and_tv: [
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      },
      {
        title: "Ooh ooh I likea this",
        subtitle: "no joke",
        thumbnail: randomThumb(),
        url: "/search"
      }
    ]
  };
  return data;
};
function Index$1() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "body-container", children: [
    /* @__PURE__ */ jsx(SummaryBox, { title: "Collections", text: "The American Archive of Public Broadcasting contains more than 50,000 hours of digitized public broadcasting programs and original materials. Browse collections below." }),
    /* @__PURE__ */ jsx(TVMenu, { title: "Featured Collections", programs: data.featured_collections, seeAllURL: "/collections" }),
    /* @__PURE__ */ jsx(TVMenu, { title: "Radio and Television Programs", programs: data.radio_and_tv, seeAllURL: "/collections" })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function BigLink(props) {
  return /* @__PURE__ */ jsx("div", { className: "biglink marbot", children: /* @__PURE__ */ jsxs("a", { href: props.url, children: [
    /* @__PURE__ */ jsx(ExternalLink, { size: 64 }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { children: props.title }),
      props.text
    ] })
  ] }) });
}
function Contribute() {
  return /* @__PURE__ */ jsxs("div", { className: "skinny-body-container", children: [
    /* @__PURE__ */ jsx(SummaryBox, { title: "Contribute Content", text: "The AAPB has received a generous Mellon Foundation grant to fund and support the digitization and preservation of publicly broadcast radio and television programs from producers and stations across the United States." }),
    /* @__PURE__ */ jsx("h3", { children: "Digitize and Preserve Your Public Broadcasting Materials" }),
    /* @__PURE__ */ jsx("div", { className: "contribute-list", children: /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(CircleCheckBig, {}),
        /* @__PURE__ */ jsx("b", { children: "No cost and no grant writing required." }),
        " Participation is completely FREE. Digitization and shipping costs will be covered by the Mellon Foundation."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(CircleCheckBig, {}),
        /* @__PURE__ */ jsx("b", { children: "Your copyright remains intact." }),
        " AAPB does not take ownership of materials and directs all licensing requests to your station."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(CircleCheckBig, {}),
        /* @__PURE__ */ jsx("b", { children: "Rediscover classic programming" }),
        " Once freed from physical formats, your past programs can be digitally repurposed for new productions, connecting with fresh audiences."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(CircleCheckBig, {}),
        /* @__PURE__ */ jsx("b", { children: "Expand your programming’s reach" }),
        " Your programs will become part of a broader national project, making them even more discoverable to the American public through providing metadata, transcripts, and various levels of access."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(CircleCheckBig, {}),
        /* @__PURE__ */ jsx("b", { children: "Preserve your programming's legacy" }),
        " Your programs will be safeguarded at the Library of Congress, ensuring that researchers and future generations can learn from and enjoy them."
      ] }),
      /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx(CircleCheckBig, {}),
        /* @__PURE__ */ jsx("b", { children: "Expert guidance" }),
        " AAPB archivists provide project management support throughout the preservation process."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "blue-box marbot", children: [
      /* @__PURE__ */ jsx("h3", { children: "Digitization Submission Procedures" }),
      "The AAPB invites stations, producers, and archivists to submit their collections for the Mellon-funded Digital Preservation Project. To streamline the process, the AAPB has developed the following step-by-step guide:",
      /* @__PURE__ */ jsx("b", { children: /* @__PURE__ */ jsxs("ol", { children: [
        /* @__PURE__ */ jsx("li", { children: "Submit a One-Sheet Summary of Materials" }),
        /* @__PURE__ */ jsx("li", { children: "Sign a Deed of Gift" }),
        /* @__PURE__ */ jsx("li", { children: "Create an Inventory" }),
        /* @__PURE__ */ jsx("li", { children: "Pack and Ship Tapes" }),
        /* @__PURE__ */ jsx("li", { children: "Receive Back Your Physical Media and Digital Files" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "marbot", children: [
      /* @__PURE__ */ jsx("b", { children: "Contact:" }),
      " For any questions about working with the American Archive of Public Broadcasting you can email: ",
      /* @__PURE__ */ jsx("a", { href: "mailto:aapb_submissions@wgbh.org", children: "aapb_submissions@wgbh.org" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "marbot", children: [
      /* @__PURE__ */ jsx("b", { children: "Submitting Digital Material:" }),
      " The AAPB also welcomes pre-digitized and born-digital programming. Again, submitting your materials to the AAPB means they become even more discoverable and accessible to researchers, the public, and archival producers interested in licensing your content. They will also be preserved at the Library of Congress. To submit your digital programming, simply follow steps 1 - 3 above, then ship your materials to us on a hard drive. We can also explore transferring them through cloud-sharing services"
    ] }),
    /* @__PURE__ */ jsx("hr", {}),
    /* @__PURE__ */ jsx("h3", { children: "Resources for Contributors" }),
    /* @__PURE__ */ jsxs("div", { children: [
      "The ",
      /* @__PURE__ */ jsx("a", { href: "/communications-toolkit", children: "communications toolkit" }),
      " guidelines help provide a template for spreading the word about your contribution to the AAPB and how your community can access historic programming from your organization."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "marbot", children: [
      "You may easily ",
      /* @__PURE__ */ jsx("a", { href: "/obtain-metadata", children: "obtain metadata" }),
      " that describe the moving image and sound assets submitted to the AAPB by your organization through the Archival Management System (AMS)."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "marbot", children: [
      /* @__PURE__ */ jsx("a", { href: "/resources", children: "Additional Resources" }),
      " can be found here."
    ] }),
    /* @__PURE__ */ jsx("h3", { children: "Learn More About the AAPB and the Digital Preservation Project" }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "In 2007, the Corporation for Public Broadcasting launched an initiative to develop a digital public broadcasting archive. The Library of Congress and GBH took over stewardship of the American Archive of Public Broadcasting in 2013 with the goal to preserve and make accessible significant historical content created by public media, and to coordinate a national effort to save at-risk public media before its content is lost to posterity. Since 2013, the AAPB has archived more than 190,000 items from more than 550 stations and producers." }),
    /* @__PURE__ */ jsx(BigLink, { url: "https://www.mellon.org/grant-story/reel-talk-saving-americas-public-media", title: "Reel Talk: Saving America’s Public Media Matters More Than You May Know", text: "If these materials remain undigitized and are simply left to time, historians and archivists won’t be the only ones who will lose." }),
    /* @__PURE__ */ jsx("hr", { className: "marbot" }),
    /* @__PURE__ */ jsx(BigLink, { url: "https://www.mellon.org/article/rescuing-the-nations-stories-one-tape-at-a-time", title: "Rescuing the Nation’s Stories One Tape at a Time", text: "Though many don’t realize it, a treasure trove of radio and television programs documenting our complex national history are stored in unofficial archives, trapped on obsolete recording formats that very few people can access." })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contribute
}, Symbol.toStringTag, { value: "Module" }));
function PullQuote(props) {
  return /* @__PURE__ */ jsxs("div", { className: "pull-quote-container", children: [
    /* @__PURE__ */ jsx("div", { className: "pull-quote-text", children: props.text }),
    /* @__PURE__ */ jsx("div", { className: "pull-quote-attribution", children: props.attribution })
  ] });
}
function PullQuoteGroup(props) {
  const [display, setDisplay] = useState(0);
  let quotes;
  if (props.quotes) {
    quotes = props.quotes;
  }
  function displayQuote(quoteIndex, length) {
    quoteIndex = quoteIndex < 0 ? length - 1 : quoteIndex;
    quoteIndex = quoteIndex == length ? 0 : quoteIndex;
    setDisplay(quoteIndex);
  }
  let bubbles = quotes.map((quote, i) => {
    if (display == i) {
      return /* @__PURE__ */ jsx("div", { className: "pull-quote-group-bubble fill" });
    } else {
      return /* @__PURE__ */ jsx("div", { className: "pull-quote-group-bubble" });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "pull-quote-group-container", children: [
    /* @__PURE__ */ jsx("div", { onClick: () => displayQuote(display - 1, quotes.length), className: "pull-quote-group-button", children: "<" }),
    /* @__PURE__ */ jsx("div", { className: "pull-quote-group-quote", children: quotes[display] }),
    /* @__PURE__ */ jsx("div", { onClick: () => displayQuote(display + 1, quotes.length), className: "pull-quote-group-button", children: ">" }),
    /* @__PURE__ */ jsx("div", { className: "pull-quote-group-bubbles", children: bubbles })
  ] });
}
function About$1() {
  return /* @__PURE__ */ jsxs("div", { className: "skinny-body-container", children: [
    /* @__PURE__ */ jsx(SummaryBox, { title: "Our Story", text: "The Library of Congress and WGBH in Boston have embarked on a project to preserve for posterity the most significant public television and radio programs of the past 60 years: The American Archive of Public Broadcasting. " }),
    /* @__PURE__ */ jsx(PullQuoteGroup, { quotes: [
      /* @__PURE__ */ jsx(PullQuote, { text: "Public television has been responsible for the production, broadcast, and dissemination of some of the most important programs which in aggregate form the richest audiovisual source of cultural history in the United States... It is still not easy to overstate the immense cultural value of this unique audiovisual legacy, whose loss would symbolize one of the great conflagrations of our age, tantamount to the burning of Alexandria’s library in the age of antiquity.", attribution: "Television and Video Preservation (1997), a Library of Congress report" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "Public broadcasting has managed to establish itself as a national treasure... Millions now watch and hear, applaud, and criticize a unique public institution which daily enters their homes with programs that inform, engage, enlighten, and delight.", attribution: "A Public Trust: The Report of the Carnegie Commission on the Future of Public Broadcasting (1979)" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "The broad mission of public broadcasting has been to help promote civil discussion, take creative risks, serve the underserved, and supply educational programming. In economic terms, the goal has been to serve the public with media content that is not sufficiently profitable for commercial broadcasters.", attribution: "The Information Needs of Communities (FCC Report, July 2011)" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "I am very excited and supportive of the proposed “American Archive” project. Because public radio and television stations have such a rich tradition of documenting our national story, it is natural to want to harness the power of digital technology and telecommunications to preserve public broadcasting’s audio, film, and video history, and to make it available to the American people. This is a project that is consistent with public broadcasting’s core mission.", attribution: "Ed Markey, Member of Congress (now Senator) (February 7, 2007)" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "In a state as vast as Alaska, where nearly 75 percent of our communities are off the road system and served by stations critically dependent on federal funding, public broadcasting plays an essential role in the lives of many of our residents. For many of these small communities, commercial broadcasting is out of the picture and public broadcasting is often times the only viable option for sharing and relaying information. From up to date local and national news to life-saving weather reports, these are services my constituents and rural Americans across the country depend on each and every day.", attribution: "Don Young, Member of Congress (R-AK)" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "This material will allow historians, writers, reporters, and just simply interested individuals to experience a community's history, national events, and social issues as they were chronicled by the people of the community.  It will provide an authentic and unique window into the past for citizens of the future.", attribution: "Bruce Ramer, Member, CPB Board of Directors" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "Unlike history books, which are widely available in libraries and on the Internet, the great majority of our audio, film and video history sits in collections that are locked away and unavailable to the American public, and could eventually be lost forever. However, unique opportunities exist to use these archives to expand Public Television’s educational mission. Educators and students could pick and choose content from which to create unique, digital learning materials capable of being presented in a variety of formats. Historians, journalists and documentary filmmakers could take advantage of the archive’s thousands of hours of raw footage for research purposes or for creating new educational works. Most importantly, digitizing these vast archives will allow the public to reap the benefits of its years of investment in public broadcasting.", attribution: "John Lawson, President, Association of Public Television,Stations" }),
      /* @__PURE__ */ jsx(PullQuote, { text: "The American Archive will ensure that the wealth of public broadcasting programming that Americans have paid for does not sit locked away, deteriorating, on aging tape and film. This rich programming represents the most comprehensive chronicle of our nation’s history, our people, our culture and our democracy. It has enormous continuing value to current and future generations and must not be left to fade away.", attribution: "Jon Abbott, Former President and CEO of WGBH Boston" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "The American people have made a huge investment in public radio and television over many decades, calculated at more than $10 billion. The American Archive will ensure that this rich source for American political, social, and cultural history and creativity will be saved and made available once again to future generations." }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "In August 2013, the Library and WGBH received a grant from the Corporation for Public Broadcasting to engage in the first phase of a long-term project to preserve public media. During this first phase, scheduled to end in September 2016, the Library and WGBH are overseeing the digitization of approximately 40,000 hours of programs selected by more than 100 public broadcasting stations throughout the nation. Dating from the 1940s to the 21st century and emanating from all regions of the nation, these programs will be available to scholars, researchers, educators, students, and the general public at the Library’s audiovisual research centers and at WGBH." }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "During the initial phase, the American Archive has launched a website to give the public online access to thousands of hours of programming – as much material as legally possible to include. More than 7,000 historic public radio and television programs are now available for streaming and more content will be added periodically. In addition, the website provides data records for approximately 2.5 million items inventoried by public broadcasting stations for this project." }),
    /* @__PURE__ */ jsxs("div", { className: "marbot", children: [
      "The collection of 40,000 hours contains thousands of high quality programs that have had national impact. The vast majority of this initial American Archive content, however, consists of regional and local programs that document American communities during the last half of the twentieth century and the first decade of the twenty-first. This extraordinary collection includes local news and public affairs programs, local history productions that document the heritage of local communities, and programs dealing with education, environmental issues, music, art, literature, dance, poetry, religion, and even filmmaking on a local level. For scholars and educators, this collection is of critical importance. Writing about public broadcasting programs produced during the turbulent decade of the 1960s, a historian of the period has stated:",
      /* @__PURE__ */ jsx(PullQuote, { text: "These programs are rich and promising in so many areas: Jazz history; civil rights history; the history of the war in Vietnam as debated and experienced by famous and ordinary people; the urban crisis and the development of urban minority political power; the programs of Lyndon Johnson’s War on Poverty and the hidden history of battles over social welfare and rights…. In discussions with Library of Congress staff about the American Archive project, I learned about tantalizing programming that critically evaluated the role that television and journalism played in shaping public perception.", attribution: "Thomas F. Jackson, University of North Carolina" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "The Library is pleased and honored to collaborate with WGBH, acclaimed universally as a long-time leader in media production, media management, preservation, and rights management issues. The Library will house these treasures in its Packard Campus for Audio Visual Conservation, the state of the art preservation facility in Culpeper, Virginia, that was built for the Library through the support and generosity of David Woodley Packard and his Packard Humanities Institute. The collection of public broadcasting materials will be preserved and made accessible to the school child as well as the scholar.  And the extraordinary multimedia treasures from the Library of Congress collections will be significantly enhanced in this important way." }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "In the future, the American Archive plans to expand by targeting important collections of materials from stations and archives that were not included in the initial phase. It is of great importance for the Library of Congress to digitize and add to the archive the unparalleled collection of public broadcasting programming that the Library has safely stored in its own vaults for more than 40 years." }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "As a public broadcaster, WGBH brings extensive knowledge of the public media system and an understanding of the core issues facing both TV and radio stations to the table. WGBH has long been positioned as a leader in the areas of media management, preservation and copyright issues. WGBH has demonstrated its strengths in these areas with the Open Vault website and other websites maintained and developed by WGBH." }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "“Acquire, preserve, and provide access to a universal collection of knowledge and the record of America’s creativity” is a key strategic goal of the Library of Congress. Adopting the American Archive project advances the mission of the Library of Congress, as America’s national library, to preserve our nation’s broadcast history for future generations and further the progress of knowledge and creativity for the benefit of the American people. The Library’s experience, expertise, and national leadership in preserving and making publicly accessible digitally reformatted audiovisual materials will ensure that future operations of the American Archive are performed according to highest standards and best practices." }),
    /* @__PURE__ */ jsx("div", { className: "marbot", children: "WGBH and the Library believe that the legacy of American public broadcasting must be preserved for future generations. We look forward to maintaining a central role in keeping, organizing and providing access to the cultural treasures created by the public media system to enhance education and knowledge of the American public." })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async () => {
  return null;
};
function Subscribe() {
  useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "homepage-search", children: [
    "Please enter your email address to stay up to date with the latest AAPB news and events!",
    /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Email Address" }),
    /* @__PURE__ */ jsx("input", { type: "button" })
  ] }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Subscribe,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function randomRecords(num) {
  var url = `${process.env.ES_URL}/${process.env.ES_INDEX_NAME}/_search`;
  var response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${process.env.ES_API_KEY}` },
    // body: JSON.stringify({ "size": num, "query": {"function_score": { "functions": [{ "random_score": { "seed": Date.now() } }], "score_mode": "sum" } } }) 
    body: JSON.stringify({ "query": { "function_score": { "query": { "match_all": {} }, "functions": [{ "random_score": {} }] } } })
  });
  var data = await response.json();
  if (data && data.hits && data.hits.hits && data.hits.hits) {
    return data.hits.hits.map((hit) => hit._source);
  }
}
function recordToTVProgram(record) {
  let title, subtitle, thumbnail, url;
  if (title && title.length > 0) {
    title = record.title;
  } else {
    title = "Untitled Record";
  }
  if (record.pbcoreDescriptionDocument && record.pbcoreDescriptionDocument.pbcoreDescription && record.pbcoreDescriptionDocument.pbcoreDescription.length > 0 && record.pbcoreDescriptionDocument.pbcoreDescription[0].text) {
    subtitle = record.pbcoreDescriptionDocument.pbcoreDescription[0].text.slice(0, 128);
  }
  thumbnail = thumbnailURL(record.guid);
  console.log("thumby", thumbnail);
  url = `/search/${record.guid}`;
  return {
    key: record.guid,
    title,
    subtitle,
    thumbnail,
    url
  };
}
const loader = async () => {
  let records = await randomRecords();
  let programs = records.map((record) => recordToTVProgram(record));
  let data = {
    featured_collections: [
      {
        key: "coll1",
        title: "first things first",
        subtitle: "giuseppe open toe",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        key: "coll2",
        title: "go back for seconds",
        subtitle: "round too",
        thumbnail: randomThumb(),
        url: "google.com"
      },
      {
        key: "coll3",
        title: "third wheels motor club",
        subtitle: "vroom vroom",
        thumbnail: randomThumb(),
        url: "google.com"
      }
    ],
    radio_and_tv: programs,
    indexName: process.env.ES_INDEX_Name
  };
  return data;
};
function Index() {
  let data = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "homepage-search", children: [
      /* @__PURE__ */ jsx("h2", { children: "Discover historic programs of publicly funded radio and television across America. Watch and listen." }),
      /* @__PURE__ */ jsx(LayoutSearch, { indexName: data.indexName })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "body-container", children: [
      /* @__PURE__ */ jsx(TVMenu, { title: "Featured Collections", programs: data.featured_collections, seeAllURL: "/collections" }),
      /* @__PURE__ */ jsx(TVMenu, { title: "Radio and Television Programs", programs: data.radio_and_tv, seeAllURL: "/collections" })
    ] })
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function About() {
  return /* @__PURE__ */ jsxs("div", { className: "skinny-body-container", children: [
    /* @__PURE__ */ jsx(SummaryBox, { title: "About the AAPB", text: "The AAPB is an initiative to preserve and make accessible public radio and television programming, ensuring its collection, management, and access." }),
    /* @__PURE__ */ jsx("div", { className: "welcome-video-container", children: /* @__PURE__ */ jsxs("caption", { children: [
      /* @__PURE__ */ jsx("iframe", { src: "https://player.vimeo.com/video/870294335?badge=0&autopause=0&player_id=0&app_id=58479", width: "500", height: "281", frameborder: "0", webkitallowfullscreen: true, mozallowfullscreen: true, allowfullscreen: true }),
      "Watch a five minute introduction to the treasures of public broadcasting, written and produced by Elizabeth Deane."
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "link-bank", children: [
      /* @__PURE__ */ jsx("a", { href: "/our-story", children: "Our Story" }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("a", { href: "/mission", children: "Vision and Mission" }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("a", { href: "/history", children: "History" }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("a", { href: "/council-and-committee", children: "Council and Committee Members" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "link-bank", children: [
      /* @__PURE__ */ jsx("a", { href: "/projects", children: "Projects" }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("a", { href: "/funding", children: "Funding" }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("a", { href: "/collaborators", children: "Library and Education Collaborators" })
    ] })
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CESE_SY7.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/components-NGGKm8hS.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DFGLLrtZ.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/components-NGGKm8hS.js", "/assets/chevron-down-BsP4tTYm.js", "/assets/LayoutSearch-CLDnVztp.js", "/assets/createLucideIcon-3-NMWDK2.js"], "css": ["/assets/root-BnjGvriM.css"] }, "routes/search._index": { "id": "routes/search._index", "parentId": "root", "path": "search", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/search._index-CajHrxfb.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/Thumbnail-Xe2tSpmq.js", "/assets/chevron-down-BsP4tTYm.js", "/assets/createLucideIcon-3-NMWDK2.js", "/assets/components-NGGKm8hS.js"], "css": [] }, "routes/search.$guid": { "id": "routes/search.$guid", "parentId": "root", "path": "search/:guid", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/search._guid-D4L38JqQ.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/components-NGGKm8hS.js"], "css": [] }, "routes/collections": { "id": "routes/collections", "parentId": "root", "path": "collections", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/collections-CPgadElg.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/TVMenu-D1MWihdo.js", "/assets/SummaryBox-DlpA-8_Q.js", "/assets/components-NGGKm8hS.js", "/assets/Thumbnail-Xe2tSpmq.js"], "css": [] }, "routes/contribute": { "id": "routes/contribute", "parentId": "root", "path": "contribute", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contribute-Dr9e-yGM.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/SummaryBox-DlpA-8_Q.js", "/assets/createLucideIcon-3-NMWDK2.js"], "css": [] }, "routes/our-story": { "id": "routes/our-story", "parentId": "root", "path": "our-story", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/our-story-B4veDkqD.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/SummaryBox-DlpA-8_Q.js"], "css": [] }, "routes/subscribe": { "id": "routes/subscribe", "parentId": "root", "path": "subscribe", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/subscribe-D8N8-m_o.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/components-NGGKm8hS.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-2DmPfSyv.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/LayoutSearch-CLDnVztp.js", "/assets/TVMenu-D1MWihdo.js", "/assets/components-NGGKm8hS.js", "/assets/createLucideIcon-3-NMWDK2.js", "/assets/Thumbnail-Xe2tSpmq.js"], "css": [] }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-CBJ1XC_S.js", "imports": ["/assets/jsx-runtime-BWtM72Fx.js", "/assets/SummaryBox-DlpA-8_Q.js"], "css": [] } }, "url": "/assets/manifest-e1c546a5.js", "version": "e1c546a5" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false, "unstable_routeConfig": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/search._index": {
    id: "routes/search._index",
    parentId: "root",
    path: "search",
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/search.$guid": {
    id: "routes/search.$guid",
    parentId: "root",
    path: "search/:guid",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/collections": {
    id: "routes/collections",
    parentId: "root",
    path: "collections",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/contribute": {
    id: "routes/contribute",
    parentId: "root",
    path: "contribute",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/our-story": {
    id: "routes/our-story",
    parentId: "root",
    path: "our-story",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/subscribe": {
    id: "routes/subscribe",
    parentId: "root",
    path: "subscribe",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route7
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
