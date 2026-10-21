import Mongoose from "mongoose";
import { Place } from "./place.js";

export const placeMongoStore = {
  async getAllPlaces() {
    const places = await Place.find().lean();
    return places;
  },

  async getPlaceById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const place = await Place.findOne({ _id: id }).lean();
      return place;
    }
    return null;
  },

  async addPlace(place) {
    const newPlace = new Place(place);
    const placeObj = await newPlace.save();
    return this.getPlaceById(placeObj._id);
  },

  async getUserPlaces(id) {
    const places = await Place.find({ userid: id }).lean();
    return places;
  },

  async deletePlaceById(id) {
    try {
      await Place.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPlaces() {
    await Place.deleteMany({});
  },

  async updatePlace(place, updatedPlace) {
    const placeDoc = await Place.findOne({ _id: place._id });
    placeDoc.name = updatedPlace.name;
    placeDoc.latitude = updatedPlace.latitude;
    placeDoc.longitude = updatedPlace.longitude;
    placeDoc.eircode = updatedPlace.eircode;
    placeDoc.category = updatedPlace.category;
    placeDoc.description = updatedPlace.description;
    await placeDoc.save();
  },
};
