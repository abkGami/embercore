import { ArrowRight, Icon } from "./Icons";
import { Doodle } from "./Doodles";

const roles = [
  {
    title: "First-Timer",
    icon: "dumbbell",
    body: "Never lifted before? We start where you are, with form first and no ego.",
    chips: ["Free assessment", "Small groups"],
  },
  {
    title: "Strength Athlete",
    icon: "barbell",
    body: "Chasing a bigger squat or a first pull-up? Calibrated plates, proper platforms, real coaching.",
    chips: ["Platforms & racks", "Peaking blocks"],
  },
  {
    title: "Busy Professional",
    icon: "clock",
    body: "Sixty minutes, zero guesswork. Plans that fit around meetings and travel.",
    chips: ["6am–9pm classes", "On-the-road plans"],
  },
  {
    title: "Competitor",
    icon: "stopwatch",
    body: "Combat, hybrid or team sport. Testing, recovery and coaching under one roof.",
    chips: ["Testing days", "Sport blocks"],
  },
];

export default function Uses() {
  return (
    <section id="uses" className="uses">
      <div className="uses-head reveal">
        <h2 className="h-section">
          Built for everyone
          <br />
          who <span className="display-accent">trains</span>.
          <Doodle kind="flame" className="flame-doodle" ember />
        </h2>
        <p className="lede">
          One floor, four ways in. Every member gets the coaching they need,
          and nothing they don&apos;t.
        </p>
      </div>

      <div className="staircase">
        {roles.map((role, i) => (
          <article
            className="role-card glass reveal"
            key={role.title}
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <div className="role-top">
              <span className="role-tag">WHO IT&apos;S FOR</span>
              <span className="pack-icon">
                <Icon name={role.icon} />
              </span>
            </div>
            <h3 className="role-title">{role.title}</h3>
            <p className="role-body">{role.body}</p>
            <div className="role-chips">
              {role.chips.map((chip) => (
                <span className="chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
            <a href="#join" className="text-link role-link">
              <span>
                Explore now <ArrowRight />
              </span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
