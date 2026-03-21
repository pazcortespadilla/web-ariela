import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Biography from "./components/Biography";
import MusicSection from "./components/MusicSection";
import Contact from "./components/Contact";
import { youtubeVideos } from "./data/media";
import { fetchLatestSoundCloudTracks } from "./services/mediaService";

function App() {
  const [soundcloudTracks, setSoundcloudTracks] = useState([]);
  const [soundcloudLoading, setSoundcloudLoading] = useState(true);
  const [soundcloudError, setSoundcloudError] = useState("");

  useEffect(() => {
    async function loadSoundCloudTracks() {
      try {
        setSoundcloudLoading(true);
        setSoundcloudError("");

        const tracks = await fetchLatestSoundCloudTracks();
        setSoundcloudTracks(tracks);
      } catch (error) {
        setSoundcloudError(error.message || "No se pudo cargar SoundCloud.");
      } finally {
        setSoundcloudLoading(false);
      }
    }

    loadSoundCloudTracks();
  }, []);

  return (
    <div className="site">
      <Header />

      <main>
        <Hero />

        <Biography />

        <MusicSection
          sectionId="soundcloud"
          title="Canciones Más Recientes"
          items={soundcloudTracks}
          type="soundcloud"
          isLoading={soundcloudLoading}
          errorMessage={soundcloudError}
        />

        <MusicSection
          sectionId="youtube"
          title="Videos"
          items={youtubeVideos}
          type="youtube"
          isLoading={false}
          errorMessage=""
        />

        <Contact />
      </main>
    </div>
  );
}

export default App;