export default function Nav() {
  return (
    <>
      <div className="nav-scrim" aria-hidden="true" />
      <header className="nav" data-in="nav">
        <a className="logo" href="#top" aria-label="Embercore home">
          <span className="logo-orb" aria-hidden="true" />
          <span>Embercore</span>
        </a>

        <nav className="nav-center" aria-label="Primary">
          <a className="nav-item" href="#packs">
            Programmes
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5 5 6.5 8 3.5" />
            </svg>
          </a>
          <a className="nav-item" href="#sched">
            Classes
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5 5 6.5 8 3.5" />
            </svg>
          </a>
          <a className="nav-item" href="#coaches">
            Community
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5 5 6.5 8 3.5" />
            </svg>
          </a>
          <a className="nav-item" href="#join">
            Membership
          </a>
        </nav>

        <div className="nav-right">
          <a className="login" href="#join">
            Member Login
          </a>
          <a className="pill pill-grey" href="#end">
            Book a Tour
          </a>
          <a className="pill pill-dark" href="#end">
            Get Your Free Week
          </a>
        </div>
      </header>
    </>
  );
}
