import { userApi } from "./api/user-api.js";
import { playlistApi } from "./api/playlist-api.js";
import { trackApi } from "./api/track-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "GET", path: "/api/playlists", config: playlistApi.find },
  { method: "POST", path: "/api/playlists", config: playlistApi.create },
  { method: "GET", path: "/api/playlists/{id}", config: playlistApi.findOne },
  { method: "DELETE", path: "/api/playlists", config: playlistApi.deleteAll },
  { method: "DELETE", path: "/api/playlists/{id}", config: playlistApi.deleteOne },

  { method: "POST", path: "/api/tracks", config: trackApi.create },
  { method: "GET", path: "/api/tracks", config: trackApi.find },
  { method: "DELETE", path: "/api/tracks", config: trackApi.deleteAll },
  { method: "GET", path: "/api/tracks/{id}", config: trackApi.findOne },
];
