import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Biography from "./components/Biography";
import MusicSection from "./components/MusicSection";
import Contact from "./components/Contact";
import { soundcloudTracks, youtubeVideos } from "./data/media";

function App() {
  return (
    <div className="site">
      <Header />

      <main>
        <Hero />

        <Biography />

        <MusicSection
          sectionId="soundcloud"
          title="Temas Recientes"
          items={soundcloudTracks}
          type="soundcloud"
        />

        <MusicSection
          sectionId="youtube"
          title="Videos"
          items={youtubeVideos}
          type="youtube"
        />

        <Contact />
      </main>
    </div>
  );
}

export default App;