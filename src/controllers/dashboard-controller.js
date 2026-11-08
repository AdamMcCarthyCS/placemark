import { db } from "../models/db.js";
import { PlaceSpec } from "../models/joi-schemas.js";

// group route objects based on the functionality that is invoked
// on the dashboard
export const dashboardController = {
  // this is each non admin user's "my places" dashboard route object
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // eslint-disable-next-line prefer-destructuring
      const category = request.query.category;
      // the filter buttons return query strings which decide the places which are filtered and shown
      const places = category ? await db.placeStore.getUserPlacesByCategoryWithUser(loggedInUser._id, category) : 
        await db.placeStore.getUserPlaces(loggedInUser._id);
      const viewData = {
        title: "Place Dashboard",
        user: loggedInUser,
        places: places,
        category: category,
      };
      return h.view("dashboard", viewData);
    },
  },

  // this is the public dashboard and also the main admin places dashboard
  publicDashboard: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // eslint-disable-next-line prefer-destructuring
      const category = request.query.category;
      // the filter buttons return query strings which decide the places which are filtered and shown
      const places = category ? await db.placeStore.getPlacesByCategoryWithUser(category) : 
        await db.placeStore.getAllPlacesWithUser();
      const viewData = {
        title: "Place Dashboard",
        user: loggedInUser,
        places: places,
        // returns a truthy value if admin is logged in used by conditionals in the partials rendered
        admin: loggedInUser.role === "admin",
        category: category,
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
      // adding a place always returns to the users "my places" dashboard
      return h.redirect("/dashboard/private");
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

};
