const paths = {
  chevron: <path d="M2 3.5 5 6.5 8 3.5" />,
  arrowRight: <path d="M2 8h11M9 4l4 4-4 4" />,
  arrowDown: <path d="M11 3v15M5 12l6 6 6-6" />,
  search: (
    <>
      <circle cx="7.5" cy="7.5" r="4.5" />
      <path d="m11 11 4 4" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m12 18 4.2-6.2" />
      <circle cx="12" cy="18" r="1" />
    </>
  ),
  deals: (
    <>
      <path d="m8.5 12.5 2 2 3-3 2.5 2.5a2 2 0 0 1 0 2.8l-2.2 2.2a2 2 0 0 1-2.8 0l-4.8-4.8a2 2 0 0 1 0-2.8L8 12" />
      <path d="M12.8 10.2 15 8l4 4-2.2 2.2" />
      <path d="M3 10.5 6 7.5l3 3" />
    </>
  ),
  forecast: (
    <>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3.5-4 3 2 4.5-6" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14c2 .5 3.2 2.2 3.6 5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  filter: (
    <>
      <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M4 9v6M7 7v10M7 12h10M17 7v10M20 9v6" />
    </>
  ),
  barbell: (
    <>
      <path d="M3 9v6M6 7v10M6 12h12M18 7v10M21 9v6" />
      <path d="M9 8v8M15 8v8" />
    </>
  ),
  plate: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  screen: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M12 16v3M8 21h8" />
    </>
  ),
  trend: (
    <>
      <path d="m4 16 5-5 3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </>
  ),
  stopwatch: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9M9 3h6M12 3v3" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 5 6 7 6 13a6 6 0 0 1-12 0c0-3 2-5 3-7 1 3 3 3 3-6Z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2" />
    </>
  ),
  megaphone: (
    <>
      <path d="m4 10 12-5v14L4 14v-4Z" />
      <path d="M16 9h2a3 3 0 0 1 0 6h-2M6 14v5a2 2 0 0 0 4 0v-3" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v5h4M9 12h6M9 16h6" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
      <path d="m14 4-4 16" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  bolt: <path d="M13 2 5 14h6l-2 8 10-13h-7l1-7Z" />,
};

export function Icon({ name, className = "", size }) {
  return (
    <span className={`icon ${className}`}>
      <svg
        viewBox={name === "arrowRight" ? "0 0 16 16" : "0 0 24 24"}
        aria-hidden="true"
        focusable="false"
        style={size ? { width: size, height: size } : undefined}
      >
        {paths[name] || paths.plate}
      </svg>
    </span>
  );
}

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

export function Chevron() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <path d="M2 3.5 5 6.5 8 3.5" />
    </svg>
  );
}
