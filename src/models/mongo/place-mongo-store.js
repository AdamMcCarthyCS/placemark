import Mongoose from "mongoose";
import { Place } from "./place.js";

/*
I have duplicated many functions here to return places both with and without the user
first and last name. The reason for this is so names can be displayed with places on the UX
this is not DRY but has the benefit of making the purpose of the calls of the functions 
more clear in the code
*/

/*
using mongoose populate to replace user id with first and last name throughout
https://mongoosejs.com/docs/populate.html#field-selection
*/

export const placeMongoStore = {
  // used in API or where all places filter is chosen on dashboard
  async getAllPlaces() {
  const places = await Place.find().lean();

  return places;
  },
    // Used to display users names with places on public dashboard
    // Used to populate site info on admin-info page
    async getAllPlacesWithUser() {
    const places = await Place.find().populate("userid", "firstName lastName").lean();

    return places;
  },

  async getPlaceById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const place = await Place.findOne({ _id: id }).lean();
      return place;
    }
    return null;
  },

  // used to include user name with place on place-details page
  async getPlaceByIdWithUser(id) {
    if (Mongoose.isValidObjectId(id)) {
      const place = await Place.findOne({ _id: id }).populate("userid", "firstName lastName").lean();
      return place;
    }
    return null;
  },

  // used to include user name on filtered view of public dsahboard
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

  async updatePlace(place) {
    const placeDoc = await Place.findOne({ _id: place._id });
    placeDoc.name = place.name;
    placeDoc.latitude = place.latitude;
    placeDoc.longitude = place.longitude;
    placeDoc.eircode = place.eircode;
    placeDoc.category = place.category;
    placeDoc.description = place.description;
    placeDoc.img = place.img;
    await placeDoc.save();
  },
};
