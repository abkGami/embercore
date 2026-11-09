import Dashboard from "./Dashboard";
import { Doodle } from "./Doodles";

const stats = [
  { num: "3,200", cap: ["members training", "across two floors"] },
  { num: "18", cap: ["coached sessions", "every single day"] },
  { num: "24/7", cap: ["floor access", "on Core and Elite"] },
  { num: "1:12", cap: ["coach-to-member", "ratio in every class"] },
];

export default function Studio() {
  return (
    <section id="studio" className="studio">
      <h2 className="h-section reveal">
        The leading independent{" "}
        <span className="accent scribble-wrap">
          strength &amp; conditioning studio
          <Doodle kind="scribble" className="scribble-under" ember />
        </span>
        <br />
        for every body that shows up.
      </h2>
      <p className="lede reveal">
        Programmes built around you. Coaching you can feel. One serious, calm
        floor to train on.
      </p>
      <div className="btn-row reveal">
        <a className="btn btn-fill" href="#join">
          Get your free week
        </a>
        <a className="btn btn-ghost" href="#end">
          Book a Tour
        </a>
      </div>

      <div className="stats reveal">
        {stats.map((stat) => (
          <div className="stat" key={stat.num}>
            <div className="stat-num">{stat.num}</div>
            <div className="stat-cap">
              {stat.cap[0]}
              <br />
              {stat.cap[1]}
            </div>
          </div>
        ))}
      </div>

      <Dashboard />
    </section>
  );
}
