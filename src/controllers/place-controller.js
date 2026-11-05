import { db } from "../models/db.js";
import { PlaceSpec, UpdatePlaceSpec } from "../models/joi-schemas.js";

export const placeController = {
  details: {
    handler: async function (request, h) {
      const place = await db.placeStore.getPlaceByIdWithUser(request.params.id);

      if (!place) {
        return h.response("Place not found").code(404);
      }
      // sets isPublic based on where route came from private or public button on list-pages.hbs
      const isPublic = request.query.from === "public";
      const isAdmin = request.auth.credentials.role === "admin";

      return h.view("place-details", {
        title: place.name,
        place,
        isPublic,
        isAdmin,
      });
    },
  },

  deletePlace: {
    handler: async function (request, h) {
      const isAdmin = request.auth.credentials.role === "admin";
      const place = await db.placeStore.getPlaceById(request.params.id);
      await db.placeStore.deletePlaceById(place._id);
      if (isAdmin) {
        return h.redirect("/dashboard/public")
      }
      return h.redirect("/dashboard/private");
    },
  },

  editPlace: {
    validate: {
      payload: UpdatePlaceSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard", { title: "Error editing place", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // get original place to use id and its name
      const place = await db.placeStore.getPlaceByIdWithUser(request.params.id);

      // stops someone from using a url to edit someone elses place
      if (!place) {
      return h.response("Place not found").code(404);
      }

      // this is another result of mongoose.populate "place.userid._id"
      if (place.userid._id.toString() !== loggedInUser._id.toString() && loggedInUser.role !== "admin") {
        return h.response("Unauthorized").code(403)
      }

      const editedPlace = {
        userid: loggedInUser._id,
        // same issue as TODO
        name: place.name,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
        eircode: request.payload.eircode,
        category: request.payload.category,
        description: request.payload.description,
      };
      await db.placeStore.updatePlace(place, editedPlace);
      return h.redirect(`/place/${place._id}`);
    },
  },

  showEditPlace: {
  handler: async function (request, h) {
    const loggedInUser = request.auth.credentials;
    
    const place = await db.placeStore.getPlaceByIdWithUser(request.params.id);

    if (!place) {
      return h.response("Place not found").code(404);
    }

    const isSocial = place.category === "Social";
    const isLandmark = place.category === "Landmark";
    const isShopping = place.category === "Shopping";
    const isFoodAndDining = place.category === "Food and Dining";

    if (place.userid._id.toString() !== loggedInUser._id.toString() && loggedInUser.role !== "admin") {
      return h.response("Forbidden").code(403);
    }
    
    const fromAdmin = request.query.from === "admin";

    return h.view("place-edit", {
      title: `Edit ${place.name}`,
      place,
      isSocial,
      isLandmark,
      isShopping,
      isFoodAndDining,
      fromAdmin,
    });
  },
},
};