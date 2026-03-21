import { useEffect, useRef, useState } from "react";

function Header() {
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40);
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMusicOpen(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function scrollToSection(sectionId) {
    setIsMusicOpen(false);

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="header-inner">
        <button className="logo-button" onClick={() => scrollToSection("home")}>
          ARIELA ZUBIETA
        </button>

        <nav className="site-nav" aria-label="Navegación principal">
          <button className="nav-link" onClick={() => scrollToSection("home")}>
            Home
          </button>

          <button className="nav-link" onClick={() => scrollToSection("biografia")}>
            Biografía
          </button>

          <div className="dropdown" ref={dropdownRef}>
            <button
              className="nav-link dropdown-toggle"
              onClick={() => setIsMusicOpen((prev) => !prev)}
              aria-expanded={isMusicOpen}
              aria-haspopup="true"
            >
              Música
            </button>

            {isMusicOpen && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-link"
                  onClick={() => scrollToSection("soundcloud")}
                >
                  SoundCloud
                </button>

                <button
                  className="dropdown-link"
                  onClick={() => scrollToSection("youtube")}
                >
                  YouTube
                </button>
              </div>
            )}
          </div>

          <button className="nav-link" onClick={() => scrollToSection("contacto")}>
            Contacto
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;