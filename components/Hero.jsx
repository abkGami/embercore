export default function Hero() {
  const scrollToStudio = () => {
    const target = document.getElementById("studio");
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="top" className="hero">
      <h1 className="hero-headline">
        <span className="hero-line">
          <span data-in="line1">Introducing</span>
        </span>
        <span className="hero-line">
          <span data-in="line2">Embercore</span>
        </span>
      </h1>

      <p className="hero-subline" data-in="subline">
        Strength Studio<sup>®</sup>
      </p>

      <div className="hero-actions" data-in="actions">
        <a className="btn btn-fill" href="#join">
          Get Your Free Week
        </a>
        <a className="btn btn-ghost" href="#end">
          Book a Tour
        </a>
      </div>

      <button
        type="button"
        className="scroll-card"
        data-in="scroll"
        onClick={scrollToStudio}
      >
        <div>
          <span>Scroll down</span>
          <span>& discover</span>
        </div>
        <span className="scroll-arrow" aria-hidden="true">
          <svg viewBox="0 0 22 22" preserveAspectRatio="none">
            <path d="M11 3 v15 M5 12 l6 6 6 -6" stroke="currentColor" stroke-width="1.6" fill="none"/>
          </svg>
        </span>
      </button>
    </section>
  );
}
