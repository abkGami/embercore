"use client";

import { useMemo, useState } from "react";
import { Doodle } from "./Doodles";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FILTERS = ["All", "Strength", "Conditioning", "Boxing", "Mobility"];

const MONDAY = [
  {
    time: "06:30",
    name: "Lower Body Strength",
    type: "Strength",
    coach: "Imani Reyes",
    level: "All levels",
    left: 4,
  },
  {
    time: "07:30",
    name: "Engine Builder",
    type: "Conditioning",
    coach: "Tomasz Kerr",
    level: "All levels",
    left: 2,
  },
  {
    time: "12:15",
    name: "Express Full Body",
    type: "Strength",
    coach: "Aiyana Cole",
    level: "Beginner",
    left: 9,
  },
  {
    time: "17:30",
    name: "Heavy Day: Squat",
    type: "Strength",
    coach: "Dre Okoye",
    level: "Advanced",
    left: 3,
  },
  {
    time: "18:30",
    name: "Boxing Fundamentals",
    type: "Boxing",
    coach: "Tomasz Kerr",
    level: "Beginner",
    left: 6,
  },
  {
    time: "19:30",
    name: "Barbell Basics",
    type: "Strength",
    coach: "Imani Reyes",
    level: "Beginner",
    left: 8,
  },
  {
    time: "20:30",
    name: "Quiet Hours Mobility",
    type: "Mobility",
    coach: "Aiyana Cole",
    level: "All levels",
    left: null,
  },
];

const CAPACITY = 12;
const BAR_HEIGHTS = [
  18, 14, 22, 30, 38, 58, 74, 86, 72, 52, 40, 36, 42, 48, 56, 64, 82, 94, 88,
  70, 54, 44, 34, 26,
];

function dayRotation(dayIndex) {
  let s = dayIndex + 1;
  s = (s * 9301 + 49297) % 233280;
  return Math.floor((s / 233280) * MONDAY.length);
}

export default function Timetable() {
  const [day, setDay] = useState(0);
  const [filter, setFilter] = useState("All");
  const [booked, setBooked] = useState(() => new Set());

  const rows = useMemo(() => {
    const offset = dayRotation(day);
    const rotated = MONDAY.map(
      (_, i) => MONDAY[(i + offset) % MONDAY.length]
    );
    return filter === "All"
      ? rotated
      : rotated.filter((row) => row.type === filter);
  }, [day, filter]);

  const toggleBooked = (key) => {
    setBooked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section id="sched" className="sched">
      <div className="sched-head">
        <div className="reveal">
          <h2 className="h-section">
            Find your slot. <span className="accent">Own the hour.</span>
            <Doodle kind="tally" className="tally-doodle" ember />
          </h2>
          <p className="lede">
            Eighteen coached sessions a day. Pick a day, filter by style, and
            hold your spot in two taps.
          </p>
        </div>

        <div className="capacity-card glass reveal">
          <div className="capacity-head">
            <span>Today at Embercore</span>
            <span className="chip live">Open now</span>
          </div>
          <div className="capacity-ring-wrap">
            <div className="capacity-ring-box">
              <svg className="capacity-ring" viewBox="0 0 132 132" aria-hidden="true">
                <circle
                  className="track"
                  cx="66"
                  cy="66"
                  r="54"
                  fill="none"
                  strokeWidth="8"
                />
                <circle
                  className="progress"
                  cx="66"
                  cy="66"
                  r="54"
                  fill="none"
                  strokeWidth="8"
                  pathLength="100"
                  transform="rotate(-90 66 66)"
                />
              </svg>
              <div className="capacity-center">
                <div className="capacity-pct">62%</div>
                <div className="capacity-label">floor capacity</div>
              </div>
            </div>
          </div>
          <div className="capacity-bars" aria-hidden="true">
            {BAR_HEIGHTS.map((height, i) => (
              <span
                key={i}
                className={`capacity-bar ${i >= 20 ? "projected" : ""}`}
                style={{ "--h": `${height}%`, "--d": `${i * 0.03}s` }}
              />
            ))}
          </div>
          <div className="capacity-foot">
            <span>00:00</span>
            <span>23:00</span>
          </div>
          <Doodle kind="stopwatch" className="stopwatch-doodle" secondary />
        </div>
      </div>

      <div className="sched-controls reveal">
        <div className="day-seg" role="group" aria-label="Choose a day">
          {DAYS.map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={day === index}
              onClick={() => setDay(index)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="filter-row" role="group" aria-label="Filter by style">
          {FILTERS.map((label) => (
            <button
              type="button"
              key={label}
              className="filter-chip"
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="sched-panel glass reveal" role="table" aria-label="Class timetable">
        <div className="sched-row head" role="row">
          <span role="columnheader">Time</span>
          <span role="columnheader">Class</span>
          <span role="columnheader">Coach</span>
          <span role="columnheader">Level</span>
          <span role="columnheader">Spots</span>
        </div>
        {rows.length === 0 ? (
          <div className="sched-row" role="row">
            <span role="cell" style={{ gridColumn: "1 / -1" }}>
              No sessions in this style today. Try another filter.
            </span>
          </div>
        ) : (
          rows.map((row, index) => {
            const key = `${DAYS[day]}-${row.time}`;
            const isBooked = booked.has(key);
            const taken = row.left === null ? 0 : CAPACITY - row.left;
            return (
              <div
                className="sched-row"
                role="row"
                key={`${DAYS[day]}-${filter}-${row.time}`}
                style={{ "--d": `${index * 0.04}s` }}
              >
                <span className="sched-time" role="cell">
                  {row.time}
                </span>
                <span className="sched-class" role="cell">
                  <b>{row.name}</b>
                  <span>{row.type}</span>
                </span>
                <span role="cell">{row.coach}</span>
                <span role="cell">
                  <span className="level-chip">{row.level}</span>
                </span>
                <span className="spots" role="cell">
                  {row.left === null ? (
                    <span className="chip">Waitlist</span>
                  ) : (
                    <>
                      <span className="meter" aria-hidden="true">
                        <span
                          style={{
                            "--fill": `${(taken / CAPACITY) * 100}%`,
                            "--d": `${index * 0.04}s`,
                          }}
                        />
                      </span>
                      <small>{row.left} left</small>
                    </>
                  )}
                  <span className="sched-book">
                    {isBooked ? (
                      <span className="chip booked">Booked</span>
                    ) : (
                      <button
                        type="button"
                        className="book-btn"
                        onClick={() => toggleBooked(key)}
                      >
                        Book
                      </button>
                    )}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
