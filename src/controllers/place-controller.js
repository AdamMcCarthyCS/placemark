import { db } from "../models/db.js";
import { PlaceSpec } from "../models/joi-schemas.js";

export const placeController = {
  details: {
    handler: async function (request, h) {
      const place = await db.placeStore.getPlaceById(request.params.id);

      if (!place) {
        return h.response("Place not found").code(404);
      }

      return h.view("place-details", {
        title: place.name,
        place,
      });
    },
  },
};