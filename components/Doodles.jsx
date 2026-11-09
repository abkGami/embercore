const shapes = {
  bolt: {
    viewBox: "0 0 24 24",
    paths: ["M13 2 5 14h6l-2 8 10-13h-7l1-7Z"],
  },
  flame: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 2c1 5 6 7 6 13a6 6 0 0 1-12 0c0-3 2-5 3-7 1 3 3 3 3-6Z",
    ],
  },
  dumbbell: {
    viewBox: "0 0 24 24",
    paths: ["M4 9v6M7 7v10M7 12h10M17 7v10M20 9v6"],
  },
  heartbeat: {
    viewBox: "0 0 120 24",
    paths: ["M2 12h32l8-9 10 18 8-9h20l6-5 6 5h26"],
  },
  tally: {
    viewBox: "0 0 36 24",
    paths: ["M6 4v16M14 4v16M22 4v16M30 4v16M2 18 34 6"],
  },
  scribble: {
    viewBox: "0 0 120 14",
    paths: ["M2 8Q12 1 22 8T42 8T62 8T82 8T102 8T118 8"],
  },
  stopwatch: {
    viewBox: "0 0 24 24",
    paths: ["M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M12 13V8M9 3h6"],
  },
  "arrow-curl": {
    viewBox: "0 0 48 24",
    paths: ["M2 18C14 2 30 2 40 14M34 12l7 3-3-7"],
  },
};

export function ChalkDefs() {
  return (
    <svg className="chalk-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="chalk" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence baseFrequency=".04" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
        </filter>
      </defs>
    </svg>
  );
}

export function Doodle({
  kind,
  className = "",
  ember = false,
  bob = false,
  secondary = false,
}) {
  const shape = shapes[kind];
  if (!shape) return null;
  return (
    <svg
      className={`doodle ${ember ? "ember" : ""} ${bob ? "bob" : ""} ${
        secondary ? "doodle-secondary" : ""
      } ${className}`}
      viewBox={shape.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <g filter="url(#chalk)">
        {shape.paths.map((d, i) => (
          <path key={i} className="doodle-draw" d={d} pathLength="1" />
        ))}
      </g>
    </svg>
  );
}
