import { Icon } from "./Icons";

function random(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function series(n, seed, base, amp, trend) {
  const rnd = random(seed);
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const r = rnd();
    out.push(
      base +
        (trend * i) / (n - 1) +
        Math.sin(i * 0.9 + seed) * amp * 0.5 +
        (r - 0.5) * amp
    );
  }
  return out;
}

function pointsFor(values, xFor, yFor) {
  return values.map((v, i) => ({ x: xFor(i), y: yFor(v, i) }));
}

function smoothPath(points) {
  if (!points.length) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const q = points[i - 1];
    const p = points[i];
    const mx = (q.x + p.x) / 2;
    d += ` C ${mx} ${q.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;
  }
  return d;
}

function Sparkline({ seed, base, amp, trend, color, id }) {
  const values = series(14, seed, base, amp, trend);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = pointsFor(
    values,
    (i) => (i * 200) / 13,
    (v) => 28 - ((v - min) / span) * 24
  );
  const line = smoothPath(pts);
  const area = `${line} L 200 30 L 0 30 Z`;
  return (
    <svg className="spark" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="chart-fill" d={area} fill={`url(#${id})`} />
      <path
        className="chart-line"
        d={line}
        pathLength="1"
        stroke={color}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const kpis = [
  {
    label: "Volume",
    value: "18.4K kg",
    delta: "+12%",
    up: true,
    color: "#FF7A3D",
    spark: { seed: 3, base: 20, amp: 7, trend: 10 },
    id: "spark-volume",
  },
  {
    label: "Intensity",
    value: "82%",
    delta: "+3pt",
    up: true,
    color: "#FFB547",
    spark: { seed: 7, base: 18, amp: 6, trend: 9 },
    id: "spark-intensity",
  },
  {
    label: "Resting HR",
    value: "58 bpm",
    delta: "−4%",
    up: false,
    color: "#F6F1EA",
    spark: { seed: 11, base: 22, amp: 6, trend: -6 },
    id: "spark-hr",
  },
  {
    label: "Streak",
    value: "24 days",
    delta: "+5",
    up: true,
    color: "#B6FF3B",
    spark: { seed: 5, base: 12, amp: 4, trend: 14 },
    id: "spark-streak",
  },
];

const mix = [
  { label: "Strength", value: 38, color: "#FF7A3D" },
  { label: "Conditioning", value: 27, color: "#FFB547" },
  { label: "Boxing", value: 19, color: "#C2410C" },
  { label: "Mobility", value: 10, color: "#F6F1EA" },
  { label: "Recovery", value: 6, color: "#B6FF3B" },
];

const deals = [
  {
    name: "Lower Body Strength",
    type: "Strength",
    start: "06:30",
    spots: "4 left",
    status: "Live",
  },
  {
    name: "Engine Builder",
    type: "Conditioning",
    start: "07:30",
    spots: "2 left",
    status: "Live",
  },
  {
    name: "Quiet Hours Mobility",
    type: "Mobility",
    start: "20:00",
    spots: "—",
    status: "Waitlist",
  },
];

const sideTop = [
  ["Performance", "gauge", true],
  ["Sessions", "deals", false, "24"],
  ["Progress", "forecast", false],
  ["Coaches", "team", false],
];

const sideLibrary = [
  ["Lifts", "dumbbell", false, "38"],
  ["Conditioning", "flame", false, "61"],
  ["Mobility", "layers", false],
  ["Boxing", "stopwatch", false, "12"],
];

export default function Dashboard() {
  const spend = series(30, 2, 90, 26, 60);
  const intensity = series(30, 9, 70, 22, 30);
  const maxVal = Math.max(...spend, ...intensity) + 10;
  const xFor = (i) => (i * 600) / 29;
  const yFor = (v) => 190 - 12 - (v / maxVal) * 160;
  const spendPts = pointsFor(spend, xFor, yFor);
  const winPts = pointsFor(intensity, xFor, yFor);
  const spendLine = smoothPath(spendPts);
  const winLine = smoothPath(winPts);
  const spendArea = `${spendLine} L 600 178 L 0 178 Z`;
  const winArea = `${winLine} L 600 178 L 0 178 Z`;
  const marker = spendPts[22];

  return (
    <div className="dashboard reveal" id="dash">
      <div className="dash-top">
        <div className="dash-mini-logo">
          <span className="logo-orb" />
          <span>Embercore</span>
        </div>
        <div className="breadcrumb">
          Programmes&nbsp;&nbsp;/&nbsp;&nbsp;<b>Strength Block 4</b>
        </div>
        <div className="dash-spacer" />
        <div className="search">
          <Icon name="search" />
          <span>Search sessions</span>
          <span className="kbd">⌘K</span>
        </div>
        <span className="chip live">In session</span>
        <span className="avatar">AK</span>
      </div>

      <div className="dash-body">
        <aside className="dash-side">
          <div className="side-group">TRAINING</div>
          {sideTop.map(([label, icon, active, count]) => (
            <div key={label} className={`side-item ${active ? "active" : ""}`}>
              <Icon name={icon} />
              <span>{label}</span>
              {count ? <span className="count">{count}</span> : null}
            </div>
          ))}
          <div className="side-group second">LIBRARY</div>
          {sideLibrary.map(([label, icon, active, count]) => (
            <div key={label} className={`side-item ${active ? "active" : ""}`}>
              <Icon name={icon} />
              <span>{label}</span>
              {count ? <span className="count">{count}</span> : null}
            </div>
          ))}
        </aside>

        <div className="dash-main">
          <div className="dash-head">
            <div className="dash-title">Training performance</div>
            <span className="chip up">▲ 18.4% vs last block</span>
            <div className="seg" role="group" aria-label="Date range">
              <button type="button" aria-pressed="false">
                7D
              </button>
              <button type="button" aria-pressed="true" className="active">
                30D
              </button>
              <button type="button" aria-pressed="false">
                90D
              </button>
            </div>
            <button type="button" className="dash-new">
              + New session
            </button>
          </div>

          <div className="kpis">
            {kpis.map((kpi) => (
              <div className="kpi" key={kpi.label}>
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-row">
                  <div className="kpi-value">{kpi.value}</div>
                  <span className={`chip ${kpi.up ? "up" : ""}`}>{kpi.delta}</span>
                </div>
                <Sparkline {...kpi.spark} color={kpi.color} id={kpi.id} />
              </div>
            ))}
          </div>

          <div className="charts">
            <div className="pane">
              <div className="pane-head">
                <span>Volume &amp; intensity</span>
                <div className="legend">
                  <span>
                    <i className="swatch" style={{ background: "#FF7A3D" }} />
                    Volume
                  </span>
                  <span>
                    <i className="swatch" style={{ background: "#FFB547" }} />
                    Intensity
                  </span>
                </div>
              </div>
              <svg
                className="area-chart"
                viewBox="0 0 600 190"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="area-spend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FF7A3D" stopOpacity=".42" />
                    <stop offset="1" stopColor="#FF7A3D" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="area-win" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FFB547" stopOpacity=".22" />
                    <stop offset="1" stopColor="#FFB547" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    x2="600"
                    y1={12 + i * 41.5}
                    y2={12 + i * 41.5}
                    stroke="rgba(255,200,160,.08)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <path className="chart-fill" d={spendArea} fill="url(#area-spend)" />
                <path className="chart-fill" d={winArea} fill="url(#area-win)" />
                <path
                  className="chart-line"
                  d={spendLine}
                  pathLength="1"
                  stroke="#FF7A3D"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="chart-line delay"
                  d={winLine}
                  pathLength="1"
                  stroke="#FFB547"
                  strokeWidth="1.6"
                  vectorEffect="non-scaling-stroke"
                />
                <g className="chart-marker">
                  <line
                    x1={marker.x}
                    x2={marker.x}
                    y1="12"
                    y2="178"
                    stroke="rgba(255,214,184,.25)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="4.5"
                    fill="#140E0B"
                    stroke="#FFC9A8"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              </svg>
            </div>

            <div className="pane">
              <div className="pane-head">
                <span>Training mix</span>
              </div>
              <div className="bars">
                {mix.map((bar) => (
                  <div className="bar-row" key={bar.label}>
                    <div className="bar-label">
                      <span>{bar.label}</span>
                      <span className="val">{bar.value}%</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          "--w": `${(bar.value / 38) * 100}%`,
                          background: `linear-gradient(90deg, ${bar.color}, ${bar.color}aa)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="deals" role="table" aria-label="Sessions">
            <div className="deal-row head" role="row">
              <span role="columnheader">Session</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Starts</span>
              <span role="columnheader">Spots</span>
              <span role="columnheader">Status</span>
            </div>
            {deals.map((deal) => (
              <div className="deal-row" role="row" key={deal.name}>
                <span role="cell">
                  <b>{deal.name}</b>
                </span>
                <span role="cell">{deal.type}</span>
                <span role="cell" className="mono">
                  {deal.start}
                </span>
                <span role="cell" className="mono">
                  {deal.spots}
                </span>
                <span role="cell">
                  <span className={`chip ${deal.status === "Live" ? "live" : ""}`}>
                    {deal.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
