import Mongoose from "mongoose";
import { Track } from "./track.js";

export const trackMongoStore = {
  async getAllTracks() {
    const tracks = await Track.find().lean();
    return tracks;
  },

  async addTrack(playlistId, track) {
    const newTrack = new Track({
      ...track,
      playlistId,
    });
    const trackObj = await newTrack.save();
    return this.getTrackById(trackObj._id);
  },

  async getTracksByPlaylistId(id) {
    const tracks = await Track.find({ playlistId: id }).lean();
    return tracks;
  },

  async getTrackById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const track = Track.findOne({ _id: id }).lean();
      return track;
    }
    return null;
  },

  async getUserTracks(userid) {
    const tracks = await Track.find({ userid: id }).lean();
    return tracks;
  },

  async deleteTrack(id) {
    try {
      await Track.deleteOne({ _id: id });
    } catch {
      console.log("bad id");
    }
  },

  async deleteAllTracks() {
    await Track.deleteMany({});
  },

  async updateTrack(track, updatedTrack) {
    const trackDoc = await Track.findOne({ _id: track._id });
    trackDoc.title = updatedTrack.title;
    trackDoc.artist = updatedTrack.artist;
    trackDoc.duration = updatedTrack.duration;
    await trackDoc.save();
  },
};
