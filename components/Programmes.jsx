"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Icon } from "./Icons";
import { Doodle } from "./Doodles";

const SESSION_PLAN = [
  '"id": "ec-0428-push-a",',
  '"athlete": "member_7f3a",',
  '"block": "strength-4/week-3",',
  '"tempo": "3-1-1-0",',
  '"rest_s": 120,',
  '"sessions": [{',
  '  "day": "mon",',
  '  "focus": "lower body",',
  '  "lifts": [{',
  '    "name": "back squat",',
  '    "sets": 5,',
  '    "reps": 5,',
  '    "load_pct": 82,',
  '    "cue": "brace, drive, own the top"',
  "  }]",
  "}]",
].join("\n");

function TypedPlan() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setCount(SESSION_PLAN.length);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!ref.current || reduced) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!started || reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const target = Math.min(
        SESSION_PLAN.length,
        Math.floor((now - start) / 12)
      );
      setCount(target);
      if (target < SESSION_PLAN.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, reduced]);

  return (
    <div className="code-block reveal" ref={ref} aria-label="Example session plan">
      <Doodle kind="heartbeat" className="heartbeat-doodle" secondary />
      <div className="code-head">
        <span>session_plan.json</span>
        <span>Embercore v2</span>
      </div>
      <div className="code-body">
        <span>{SESSION_PLAN.slice(0, reduced ? SESSION_PLAN.length : count)}</span>
        {reduced ? null : <span className="code-caret" aria-hidden="true" />}
      </div>
      <div className="code-foot">
        <span>plan ec.push.0428</span>
        <span className="ready">ready</span>
      </div>
    </div>
  );
}

const cards = [
  {
    index: "01",
    icon: "plate",
    eyebrow: "STRENGTH BLOCKS",
    title: "Get Stronger, On Schedule",
    body: "Periodised barbell programmes with a clear number for every set.",
    cap: "Avg. 12-week strength gain",
    metric: "+18%",
    link: "See programmes",
    lead: true,
  },
  {
    index: "02",
    icon: "screen",
    eyebrow: "CONDITIONING",
    title: "Build an Engine That Lasts",
    body: "Intervals, rowing and sled work scaled to your heart rate.",
    cap: "Avg. class intensity",
    metric: "82%",
    link: "See classes",
  },
  {
    index: "03",
    icon: "trend",
    eyebrow: "RECOVERY",
    title: "Move Better, Train More",
    body: "Mobility, breathwork and heat to keep you training week after week.",
    cap: "Avg. soreness change",
    metric: "−17%",
    link: "See recovery",
  },
];

const steps = [
  {
    num: "01",
    lead: "Pick a programme, then tune it",
    body: "Choose your goal, days and equipment.",
  },
  {
    num: "02",
    lead: "Meet your coach",
    body: "A 30-minute assessment sets your starting loads.",
  },
  {
    num: "03",
    lead: "Train to a plan every session",
    body: "Log lifts in the app and watch the numbers climb.",
  },
];

export default function Programmes() {
  return (
    <section id="packs" className="packs">
      <div className="split-row">
        <div className="split-left reveal">
          <h2 className="h-section">
            Choose boldly, train smart, lift heavy, recover well,{" "}
            <span className="accent">track </span>
            <span className="display-accent">progress.</span>
            <Doodle kind="dumbbell" className="dumbbell-doodle" ember />
          </h2>
          <p className="lede">
            Start from a proven programme, tune it to your goals, then take it
            to the floor with a coach beside you.
          </p>
          <div className="split-actions">
            <a className="btn btn-white" href="#coaches">
              Member Stories
            </a>
            <a className="btn btn-dk" href="#end">
              Book a Tour
            </a>
          </div>
        </div>
        <div className="reveal">
          <TypedPlan />
        </div>
      </div>

      <div className="pack-grid">
        {cards.map((card, i) => (
          <article
            className={`pack-card ${card.lead ? "lead" : "glass"} reveal`}
            key={card.title}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="pack-top">
              <span className="pack-index">{card.index}</span>
              <span className="pack-icon">
                <Icon name={card.icon} />
              </span>
            </div>
            <div className="pack-eyebrow">{card.eyebrow}</div>
            <h3 className="pack-title">{card.title}</h3>
            <p className="pack-body">{card.body}</p>
            <div className="pack-meta">
              <div>
                <div className="pack-metric-cap">{card.cap}</div>
                <div className="pack-metric">{card.metric}</div>
              </div>
              <a className="text-link pack-link" href="#sched">
                {card.link} <ArrowRight />
              </a>
            </div>
          </article>
        ))}
      </div>

      <ol className="steps reveal">
        {steps.map((step) => (
          <li className="step" key={step.num}>
            <span className="step-num">{step.num}</span>
            <span>
              <b>{step.lead}</b> {step.body}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
