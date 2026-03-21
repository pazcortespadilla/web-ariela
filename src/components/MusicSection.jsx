function MusicSection({
  sectionId,
  title,
  items,
  type,
  isLoading = false,
  errorMessage = "",
}) {
  return (
    <section id={sectionId} className="content-section content-section--light">
      <div className="container">
        <div className="section-title">
          <h2>{title}</h2>
        </div>
      </div>

      <div className="container">
        {isLoading && (
          <div className="media-status-card">
            <p>Cargando contenido...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="media-status-card media-status-card--error">
            <p>{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && items.length === 0 && (
          <div className="media-status-card">
            <p>No hay contenido disponible todavía.</p>
          </div>
        )}

        {!isLoading && !errorMessage && items.length > 0 && (
          <div className="media-grid">
            {items.slice(0, 2).map((item) => (
              <div className="media-card" key={item.id || item.title}>
                <span className="media-holder">
                  <iframe
                    title={item.title}
                    className={`media-frame ${
                      type === "youtube"
                        ? "media-frame--youtube"
                        : "media-frame--soundcloud"
                    }`}
                    src={item.embedUrl}
                    frameBorder="0"
                    allow={
                      type === "youtube"
                        ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        : "autoplay"
                    }
                    allowFullScreen={type === "youtube"}
                    scrolling={type === "soundcloud" ? "no" : undefined}
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MusicSection;