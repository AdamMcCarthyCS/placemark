import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { trackJsonStore } from "./track-json-store.js";

export const playlistJsonStore = {
  async getAllPlaylists() {
    await db.read();
    return db.data.playlists;
  },

  async addPlaylist(playlist) {
    await db.read();
    playlist._id = v4();
    db.data.playlists.push(playlist);
    await db.write();
    return playlist;
  },

  async getPlaylistById(id) {
    await db.read();
    const list = db.data.playlists.find((playlist) => playlist._id === id);
    if (list === undefined) {
      return null;
    }
    list.tracks = await trackJsonStore.getTracksByPlaylistId(list._id);
    return list;
  },

  async getUserPlaylists(userid) {
    await db.read();
    const userPlaylists = db.data.playlists.filter((playlist) => playlist.userid === userid);
    return userPlaylists;
  },

  async deletePlaylistById(id) {
    await db.read();
    const index = db.data.playlists.findIndex((playlist) => playlist._id === id);
    if (index !== -1) {
      db.data.playlists.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllPlaylists() {
    db.data.playlists = [];
    await db.write();
  },
};
