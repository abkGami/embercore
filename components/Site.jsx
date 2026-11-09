"use client";

import { useEffect } from "react";
import Scene from "./Scene";
import Nav from "./Nav";
import Hero from "./Hero";
import Studio from "./Studio";
import Programmes from "./Programmes";
import Timetable from "./Timetable";
import Coaches from "./Coaches";
import Uses from "./Uses";
import Membership from "./Membership";
import CtaFooter from "./CtaFooter";
import { ChalkDefs } from "./Doodles";

const ENTRANCE = {
  nav: {
    from: { opacity: 0, transform: "translateY(-14px)" },
    delay: 0,
    duration: 900,
  },
  line1: {
    from: { opacity: 0, transform: "translateY(105%)" },
    delay: 250,
    duration: 1100,
  },
  line2: {
    from: { opacity: 0, transform: "translateY(105%)" },
    delay: 370,
    duration: 1100,
  },
  subline: {
    from: { opacity: 0, transform: "translateY(12px)" },
    delay: 620,
    duration: 900,
  },
  actions: {
    from: { opacity: 0, transform: "translateY(14px)" },
    delay: 740,
    duration: 900,
  },
  scroll: {
    from: { opacity: 0, transform: "translateY(40px) scale(.96)" },
    delay: 880,
    duration: 1100,
  },
};

const EASE = "cubic-bezier(.2,.75,.2,1)";

export default function Site() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    const setUnit = () => {
      const width = root.clientWidth;
      const frame = width <= 820 ? 390 : 1440;
      root.style.setProperty("--u", `${width / frame}px`);
    };
    setUnit();

    let resizeTick = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeTick);
      resizeTick = requestAnimationFrame(setUnit);
    };
    window.addEventListener("resize", onResize);

    const failsafe = setTimeout(() => root.classList.remove("anim"), 3000);

    if (reduced) {
      root.classList.remove("anim");
    } else {
      const nodes = document.querySelectorAll("[data-in]");
      nodes.forEach((node) => {
        const key = node.getAttribute("data-in");
        const spec = ENTRANCE[key];
        if (!spec || typeof node.animate !== "function") return;
        node.animate([spec.from, { opacity: 1, transform: "none" }], {
          duration: spec.duration,
          delay: spec.delay,
          easing: EASE,
          fill: "backwards",
        });
      });
      requestAnimationFrame(() => root.classList.remove("anim"));
    }

    const reveals = Array.from(document.querySelectorAll(".reveal"));
    let observer = null;
    if (reduced) {
      reveals.forEach((node) => node.classList.add("in"));
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      reveals.forEach((node) => observer.observe(node));
    }

    const onMotionChange = () => {
      if (reducedQuery.matches) {
        reduced = true;
        root.classList.remove("anim");
        reveals.forEach((node) => node.classList.add("in"));
        observer?.disconnect();
      }
    };
    reducedQuery.addEventListener("change", onMotionChange);

    const nav = document.querySelector(".nav");
    let scrollTick = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollTick);
      scrollTick = requestAnimationFrame(() => {
        const scrolled = window.scrollY > window.innerHeight * 0.5;
        nav?.classList.toggle("scrolled", scrolled);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(failsafe);
      cancelAnimationFrame(resizeTick);
      cancelAnimationFrame(scrollTick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      reducedQuery.removeEventListener("change", onMotionChange);
      observer?.disconnect();
    };
  }, []);

  return (
    <>
      <ChalkDefs />
      <Scene />
      <div className="page">
        <Nav />
        <main>
          <Hero />
          <Studio />
          <Programmes />
          <Timetable />
          <Coaches />
          <Uses />
          <Membership />
          <CtaFooter />
        </main>
      </div>
    </>
  );
}
