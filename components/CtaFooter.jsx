import { Doodle } from "./Doodles";

const columns = [
  {
    heading: "TRAIN",
    links: ["Programmes", "Classes", "Coaching", "Recovery"],
  },
  {
    heading: "WHO IT'S FOR",
    links: [
      "First-Timer",
      "Strength Athlete",
      "Busy Professional",
      "Competitor",
    ],
  },
  {
    heading: "VISIT",
    links: ["Hours", "Locations", "Book a Tour", "Parking"],
  },
  {
    heading: "COMPANY",
    links: ["Careers", "Journal", "Help Centre", "Contact Us"],
  },
];

export default function CtaFooter() {
  return (
    <section id="end" className="end">
      <div className="cta-panel glass reveal">
        <h2>
          Start Training
          <br />
          <span className="display-accent">Stronger</span> Now!
        </h2>
        <Doodle kind="heartbeat" className="heartbeat-cta" />
        <p className="lede">
          Free to start. Your first coached session can be on the floor before
          your coffee goes cold.
        </p>
        <div className="btn-row">
          <a className="btn btn-fill" href="#join">
            Get Your Free Week
          </a>
          <a className="btn btn-ghost" href="#sched">
            Book a Tour
          </a>
        </div>
        <p className="cta-note">
          No card needed&nbsp; ·&nbsp; 7 days free&nbsp; ·&nbsp; Cancel anytime
        </p>
      </div>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="logo" href="#top">
              <span className="logo-orb" aria-hidden="true" />
              <span>Embercore</span>
            </a>
            <p>
              The independent strength studio for people who want real
              coaching, honest programming and a floor that never feels
              crowded.
            </p>
            <div className="footer-status">
              <span className="chip live">Floor open now</span>
            </div>
          </div>
          {columns.map((column) => (
            <div className="footer-col" key={column.heading}>
              <h3>{column.heading}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#top">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="legal">
          <span>©2026 Embercore: Strength Studio®</span>
          <div className="legal-links">
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#top">Accessibility</a>
          </div>
        </div>

        <div className="wordmark" aria-hidden="true">
          Embercore
        </div>
      </footer>
    </section>
  );
}
