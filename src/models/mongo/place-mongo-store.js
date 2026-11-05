import Mongoose from "mongoose";
import { Place } from "./place.js";

export const placeMongoStore = {
  async getAllPlaces() {
  // use mongoose populate to replace user id with name for public dashboard
  // https://mongoosejs.com/docs/populate.html#field-selection
  const places = await Place.find().populate("userid", "firstName lastName").lean();

  return places;
  },

    async getAllPlacesWithUser() {
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

  async getPlaceByIdWithUser(id) {
    if (Mongoose.isValidObjectId(id)) {
      const place = await Place.findOne({ _id: id }).populate("userid", "firstName lastName").lean();
      return place;
    }
    return null;
  },

  async getPlacesByCategoryWithUser(placeCategory) {
    if (["Social", "Landmark", "Food and Dining", "Shopping"].includes(placeCategory)) {
      const place = Place.find({category: placeCategory}).populate("userid", "firstName lastName").lean();
      return place;
      }
      return null;
    },

  async getPlacesByCategory(placeCategory) {
    if (["Social", "Landmark", "Food and Dining", "Shopping"].includes(placeCategory)) {
      const place = Place.find({category: placeCategory}).lean();
      return place;
      }
      return null;
    },
 
  async getUserPlacesByCategoryWithUser(userid, placeCategory) {
    if (Mongoose.isValidObjectId(userid)) {
      if (["Social", "Landmark", "Food and Dining", "Shopping"].includes(placeCategory)) { 
        const place = Place.find({category: placeCategory, userid: userid}).populate("userid", "firstName lastName").lean();
        return place;
        }
        return null;
      }
      return null;
    },

    async getUserPlacesByCategory(userid, placeCategory) {
    if (Mongoose.isValidObjectId(userid)) {
      if (["Social", "Landmark", "Food and Dining", "Shopping"].includes(placeCategory)) { 
        const place = Place.find({category: placeCategory, userid: userid}).lean();
        return place;
        }
        return null;
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
