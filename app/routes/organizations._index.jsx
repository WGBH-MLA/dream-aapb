import { useLoaderData, Link } from "react-router";
import Mappy from "../components/Mappy";
import orgs from "../data/orgs.json";
import SummaryBox from "../components/SummaryBox";
import { scrollToTop } from "../utils/helpers";

export const loader = async () => {
  return {
    orgs: orgs || {},
  };
};

const stateSlug = (state) =>
  `state-${state.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export default function Organizations() {
  const { orgs: orgData = {}, esIndex, tsIndex } = useLoaderData() || {};
  const activeIndex = tsIndex ? `${esIndex},${tsIndex}` : esIndex;

  // Convert the keyed JSON object into an array with org IDs
  const organizations = Object.entries(orgData).map(([orgid, org]) => ({
    orgid,
    ...org,
  }));

  const organizationsByState = organizations.reduce((groups, org) => {
    const state = org.State || "Other";

    if (!groups[state]) {
      groups[state] = [];
    }

    groups[state].push(org);
    return groups;
  }, {});

  const states = Object.keys(organizationsByState).sort();

  states.forEach((state) => {
    organizationsByState[state].sort((a, b) =>
      (a["Short name"] || a.Name || "").localeCompare(
        b["Short name"] || b.Name || ""
      )
    );
  });

  const stateLinks = states.map((state) => ({
    name: state,
    href: `#${stateSlug(state)}`,
  }));

  const stateCatalogUrl = (stateOrgs) => {
    const params = stateOrgs
      .map((org, i) => {
        const orgName = org["Short name"] || org.Name;
        return `${encodeURIComponent(activeIndex)}[refinementList][contributing_orgs][${i}]=${encodeURIComponent(orgName)}`;
      })
      .join("&");

    return `/catalog?${params}`;
  };

  return (
    <div className="body-container">
      <SummaryBox
        title="Participating Organizations"
        text="Learn about the history, significant productions, and archive contributions of more than 200 public media stations and archives. View all participating organizations."
      />

      <div className="mappy-container marbot">
        <Mappy stateLinks={stateLinks} />
      </div>

      <div className="organization-directory">
        {states.map((state) => {
          const stateOrgs = organizationsByState[state];

          return (
            <section
              key={state}
              id={stateSlug(state)}
              className="organization-state"
            >
              <div className="organization-state-header">
                <h2>{state}</h2>
                {state !== "Other" && (
                  <Link
                    to={stateCatalogUrl(stateOrgs)}
                    className="organization-state-records"
                  >
                    All records from {state} &rarr;
                  </Link>
                )}
              </div>

              <ul className="organization-state-list">
                {stateOrgs.map((org) => (
                  <li key={org.orgid} className="organization-state-item">
                    <Link
                      to={`/organizations/${org.orgid}`}
                      className="organization-name"
                    >
                      {org["Short name"] || org.Name}
                    </Link>

                    {org.City && (
                      <div className="organization-location">
                        {org.City}, {state}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="organization-back-to-top">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="return-to-top-btn"
                >
                  &uarr; Return to top
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}