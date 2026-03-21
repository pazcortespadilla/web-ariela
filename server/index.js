import express from "express";
import dotenv from "dotenv";
import { Buffer } from "node:buffer";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const SOUNDCLOUD_PROFILE_URL =
  process.env.SOUNDCLOUD_PROFILE_URL || "https://soundcloud.com/ariela00";

let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

let tracksCache = {
  data: null,
  expiresAt: 0,
};

function buildSoundCloudEmbedUrl(trackUrl) {
  const encodedTrackUrl = encodeURIComponent(trackUrl);

  return `https://w.soundcloud.com/player/?url=${encodedTrackUrl}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false`;
}

async function getSoundCloudAccessToken() {
  const now = Date.now();

  if (tokenCache.accessToken && now < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.SOUNDCLOUD_CLIENT_ID;
  const clientSecret = process.env.SOUNDCLOUD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Faltan SOUNDCLOUD_CLIENT_ID y/o SOUNDCLOUD_CLIENT_SECRET en el archivo .env"
    );
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://secure.soundcloud.com/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json; charset=utf-8",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `No se pudo obtener el token de SoundCloud. Status ${response.status}. ${errorText}`
    );
  }

  const data = await response.json();

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in || 3600) * 1000,
  };

  return tokenCache.accessToken;
}

async function soundCloudGet(path, accessToken, queryParams = {}) {
  const url = new URL(`https://api.soundcloud.com${path}`);

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Accept: "application/json; charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error consultando SoundCloud (${response.status}). ${errorText}`
    );
  }

  return response.json();
}

async function getLatestSoundCloudTracks() {
  const now = Date.now();

  if (tracksCache.data && now < tracksCache.expiresAt) {
    return tracksCache.data;
  }

  const accessToken = await getSoundCloudAccessToken();

  const resolvedUser = await soundCloudGet("/resolve", accessToken, {
    url: SOUNDCLOUD_PROFILE_URL,
  });

  const rawTracks = await soundCloudGet(
    `/users/${resolvedUser.id}/tracks`,
    accessToken,
    {
      limit: 20,
    }
  );

  const latestTracks = rawTracks
    .filter((track) => {
      return track?.permalink_url && track?.title;
    })
    .sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, 2)
    .map((track) => {
      return {
        id: track.id,
        title: track.title,
        createdAt: track.created_at,
        permalinkUrl: track.permalink_url,
        embedUrl: buildSoundCloudEmbedUrl(track.permalink_url),
      };
    });

  tracksCache = {
    data: latestTracks,
    expiresAt: now + 5 * 60 * 1000,
  };

  return latestTracks;
}

app.get("/api/media/soundcloud", async (req, res) => {
  try {
    const tracks = await getLatestSoundCloudTracks();

    res.json({
      tracks,
    });
  } catch (error) {
    console.error("Error en /api/media/soundcloud:", error);

    res.status(500).json({
      message: "No se pudieron obtener las canciones de SoundCloud.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});