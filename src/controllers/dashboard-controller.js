import { db } from "../models/db.js";
import { PlaceSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // eslint-disable-next-line prefer-destructuring
      const category = request.query.category;
      const places = category ? await db.placeStore.getUserPlacesByCategory(loggedInUser._id, category) : 
        await db.placeStore.getUserPlaces(loggedInUser._id);
      const viewData = {
        title: "Place Dashboard",
        user: loggedInUser,
        places: places,
      };
      return h.view("dashboard", viewData);
    },
  },

  publicDashboard: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // eslint-disable-next-line prefer-destructuring
      const category = request.query.category;
      const places = category ? await db.placeStore.getPlacesByCategory(category) : 
        await db.placeStore.getAllPlaces();
      const viewData = {
        title: "Place Dashboard",
        user: loggedInUser,
        places: places,
      };
      return h.view("view-only-dashboard", viewData);
    },
  },

  addPlace: {
    validate: {
      payload: PlaceSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard", { title: "Error adding place", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPlace = {
        userid: loggedInUser._id,
        name: request.payload.name,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        eircode: request.payload.eircode,
        category: request.payload.category,
        description: request.payload.description,
      };
      await db.placeStore.addPlace(newPlace);
      return h.redirect("/dashboard/private");
    },
  },

};
