function Hero() {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-kicker">Sitio Oficial</p>

        <h1>ARIELA ZUBIETA</h1>

        <p className="hero-description">
          Compositora
        </p>

        <div className="hero-actions">
          <button
            className="hero-button hero-button--primary"
            onClick={() => scrollToSection("soundcloud")}
          >
            Escuchar
          </button>

          <button
            className="hero-button hero-button--secondary"
            onClick={() => scrollToSection("youtube")}
          >
            Ver videos
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;