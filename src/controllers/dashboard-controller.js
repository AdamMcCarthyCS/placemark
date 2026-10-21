import { db } from "../models/db.js";
import { PlaceSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const places = await db.placeStore.getUserPlaces(loggedInUser._id);
      const viewData = {
        title: "Place Dashboard",
        user: loggedInUser,
        places: places,
      };
      return h.view("dashboard", viewData);
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
      return h.redirect("/dashboard");
    },
  },

  deletePlace: {
    handler: async function (request, h) {
      const place = await db.placeStore.getPlaceById(request.params.id);
      await db.placeStore.deletePlaceById(place._id);
      return h.redirect("/dashboard");
    },
  },
};
