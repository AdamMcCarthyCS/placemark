import { db } from "../models/db.js";
import { PlaceSpec } from "../models/joi-schemas.js";

export const placeController = {
  details: {
    handler: async function (request, h) {
      const place = await db.placeStore.getPlaceById(request.params.id);

      if (!place) {
        return h.response("Place not found").code(404);
      }
      // sets isPublic based on where route came from private or public button on list-pages.hbs
      const isPublic = request.query.from === "public";

      return h.view("place-details", {
        title: place.name,
        place,
        isPublic,
      });
    },
  },

  deletePlace: {
    handler: async function (request, h) {
      const place = await db.placeStore.getPlaceById(request.params.id);
      await db.placeStore.deletePlaceById(place._id);
      return h.redirect("/dashboard/private");
    },
  },

  editPlace: {
    validate: {
      payload: PlaceSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard", { title: "Error editing place", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      // get original place to use id and its name
      const place = await db.placeStore.getPlaceById(request.params.id);

      // stops someone from using a url to edit someone elses place
      if (place.userid.toString() !== loggedInUser._id.toString()) {
        return h.response("Unauthorized").code(403)
      }

      const editedPlace = {
        userid: loggedInUser._id,
        name: place.name,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        eircode: request.payload.eircode,
        category: request.payload.category,
        description: request.payload.description,
      };
      await db.placeStore.updatePlace(editedPlace);
      return h.redirect(`/place/${place._id}`);
    },
  },
};