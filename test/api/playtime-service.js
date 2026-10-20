import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const playtimeService = {
  playtimeUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.playtimeUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.playtimeUrl}/api/users`);
    return res.data;
  },

  async deleteUser(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/users/${id}`);
    return res;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.playtimeUrl}/api/users`);
    return res.data;
  },



  async createPlaylist(playlist) {
    const res = await axios.post(`${this.playtimeUrl}/api/playlists`, playlist);
    return res.data;
  },

  async getPlaylist(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/playlists/${id}`);
    return res.data;
  },

  async getAllPlaylists() {
    const res = await axios.get(`${this.playtimeUrl}/api/playlists`);
    return res.data;
  },

  async deletePlaylist(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/playlists/${id}`);
    return res;
  },

  async deleteAllPlaylists() {
    const res = await axios.delete(`${this.playtimeUrl}/api/playlists`);
    return res.data;
  },



  async createTrack(playlistId, track) {
    const res = await axios.post(`${this.playtimeUrl}/api/tracks`, { playlistId, track });
    return res.data;
  },

  async getAllTracks() {
    const res = await axios.get(`${this.playtimeUrl}/api/tracks`);
    return res.data;
  },

  async deleteAllTracks() {
    const res = await axios.delete(`${this.playtimeUrl}/api/tracks`);
    return res.data;
  },

  async getTrack(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/tracks/${id}`);
    return res.data;
  },
};
