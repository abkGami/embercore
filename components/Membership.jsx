"use client";

import { useState } from "react";
import { Doodle } from "./Doodles";

const plans = [
  {
    name: "Drop-in",
    price: "18",
    annual: null,
    period: "/ visit",
    desc: "One session, no strings. Walk in, train with a coach on the floor.",
    checks: [
      "Any open floor session",
      "Locker and shower",
      "Coach on the floor",
      "Book up to 24h ahead",
      "No commitment",
    ],
    button: "Book a drop-in",
    variant: "ghost",
  },
  {
    name: "Core",
    price: "89",
    annual: "71",
    period: "/ month",
    desc: "The full coached floor, programmed and tracked in the app.",
    checks: [
      "Unlimited floor access",
      "All coached classes",
      "Programme in the app",
      "Free assessment",
      "Book 7 days ahead",
    ],
    button: "Start your free week",
    variant: "white",
    featured: true,
  },
  {
    name: "Elite",
    price: "149",
    annual: "119",
    period: "/ month",
    desc: "More access, more eyes on you, and the recovery suite included.",
    checks: [
      "Everything in Core",
      "24/7 floor access",
      "Monthly 1:1 coaching",
      "Recovery suite",
      "Guest passes",
    ],
    button: "Start Elite",
    variant: "ghost",
  },
];

function Check() {
  return (
    <span className="check-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export default function Membership() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="join" className="join">
      <div className="join-head reveal">
        <h2 className="h-section">
          Pick your{" "}
          <span className="accent pace-wrap">
            pace.
            <Doodle kind="scribble" className="pace-scribble" secondary />
          </span>
        </h2>
        <p className="lede">
          Clear prices, no joining fee, pause whenever life gets in the way.
        </p>
        <div
          className="billing-toggle"
          role="group"
          aria-label="Billing period"
        >
          <button
            type="button"
            aria-pressed={!annual}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={annual}
            onClick={() => setAnnual(true)}
          >
            Annual <span className="save-chip">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="plan-grid">
        <Doodle kind="flame" className="join-flame" ember secondary />
        {plans.map((plan, i) => {
          const shown = annual && plan.annual ? plan.annual : plan.price;
          return (
            <article
              className={`plan-card reveal ${
                plan.featured ? "featured" : "glass"
              }`}
              key={plan.name}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="plan-top">
                <span className="plan-name">{plan.name}</span>
                {plan.featured ? (
                  <span className="popular">MOST POPULAR</span>
                ) : null}
              </div>
              <div className="plan-price">
                <span className="price-value" key={shown}>
                  ${shown}
                </span>
                <span className="plan-period">{plan.period}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <ul className="plan-checks">
                {plan.checks.map((check) => (
                  <li key={check}>
                    <Check />
                    {check}
                  </li>
                ))}
              </ul>
              <a href="#end" className={`btn btn-${plan.variant}`}>
                {plan.button}
              </a>
            </article>
          );
        })}
      </div>

      <p className="plan-fine">
        No joining fee&nbsp; ·&nbsp; Pause anytime&nbsp; ·&nbsp; 7-day free week
        on Core and Elite
      </p>
    </section>
  );
}
