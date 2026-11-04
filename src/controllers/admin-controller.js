import { db } from "../models/db.js";
import { PlaceSpec } from "../models/joi-schemas.js";

export const adminController = {
  info: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (loggedInUser.role !== "admin") {
        return h.response("Unauthorized").code(403) 
      }
      return h.view("admin-info");
    },
  },
}