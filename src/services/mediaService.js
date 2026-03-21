export async function fetchLatestSoundCloudTracks() {
  const response = await fetch("/api/media/soundcloud");

  if (!response.ok) {
    let errorMessage = "No se pudo cargar SoundCloud.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.details || errorMessage;
    } catch {
      // No hacemos nada si la respuesta no viene en JSON
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  return data.tracks || [];
}