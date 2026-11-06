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



  async createPlace(place) {
    const res = await axios.post(`${this.playtimeUrl}/api/places`, place);
    return res.data;
  },

  async getPlace(id) {
    const res = await axios.get(`${this.playtimeUrl}/api/places/${id}`);
    return res.data;
  },

  async getPlacesByUser(userid) {
    const res = await axios.get(`${this.playtimeUrl}/api/places/user/${userid}`);
    return res.data; 
  },

  async getPlacesCategory(category) {
    const res = await axios.get(`${this.playtimeUrl}/api/places/category/${category}`);
    return res.data;
  },

  async getAllPlaces() {
    const res = await axios.get(`${this.playtimeUrl}/api/places`);
    return res.data;
  },

  async deletePlace(id) {
    const res = await axios.delete(`${this.playtimeUrl}/api/places/${id}`);
    return res;
  },

  async deleteAllPlaces() {
    const res = await axios.delete(`${this.playtimeUrl}/api/places`);
    return res.data;
  },

}

  
