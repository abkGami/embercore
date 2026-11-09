import Image from "next/image";
import { ArrowRight } from "./Icons";
import { Doodle } from "./Doodles";

const coaches = [
  {
    index: "01",
    name: "Imani Reyes",
    role: "Head of Strength",
    chips: ["Powerlifting", "Technique"],
    photo: "/assets/embercore-coach-01.webp",
  },
  {
    index: "02",
    name: "Tomasz Kerr",
    role: "Conditioning & Boxing",
    chips: ["Intervals", "Pad work"],
    photo: "/assets/embercore-coach-02.webp",
  },
  {
    index: "03",
    name: "Aiyana Cole",
    role: "Mobility & Recovery",
    chips: ["Breathwork", "Rehab-aware"],
    photo: "/assets/embercore-coach-03.webp",
  },
  {
    index: "04",
    name: "Dre Okoye",
    role: "Performance",
    chips: ["Speed & power", "Testing"],
    photo: "/assets/embercore-coach-04.webp",
  },
];

export default function Coaches() {
  return (
    <section id="coaches" className="coaches">
      <div className="coach-head">
        <div className="reveal">
          <h2 className="h-section">
            Coached by people who <span className="accent">lift.</span>
            <Doodle kind="bolt" className="bolt-doodle" ember />
          </h2>
          <p className="lede">
            Four head coaches, one standard: you leave every session knowing
            exactly what to do next.
          </p>
        </div>
        <a href="#end" className="text-link coach-head-link">
          Meet the team <ArrowRight />
        </a>
      </div>

      <div className="coach-grid">
        <Doodle kind="arrow-curl" className="arrow-curl-doodle" bob secondary />
        {coaches.map((coach, i) => (
          <article
            className="coach-card glass reveal"
            key={coach.name}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="coach-photo">
              <Image
                src={coach.photo}
                alt={`${coach.name}, ${coach.role}`}
                width={960}
                height={1280}
                sizes="(max-width: 820px) 78vw, 25vw"
                loading="lazy"
              />
            </div>
            <div className="coach-meta">
              <span className="coach-index">{coach.index}</span>
              <h3 className="coach-name">{coach.name}</h3>
              <p className="coach-spec">{coach.role}</p>
              <div className="coach-chips">
                {coach.chips.map((chip) => (
                  <span className="chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
              <a href="#end" className="text-link coach-link">
                <span>
                  Book an intro <ArrowRight />
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="coach-note">
        Portraits and coach profiles are fictional placeholders for this build.
      </p>
    </section>
  );
}
