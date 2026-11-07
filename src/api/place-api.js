import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { PlaceArraySpec, PlaceSpecPlus, PlaceSpec, IdSpec, CategorySpec } from "../models/joi-schemas.js"
import { validationError } from "./logger.js"

export const placeApi = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const places = await db.placeStore.getAllPlaces();
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PlaceArraySpec, failAction: validationError },
    description: "Get all places",
    notes: "Returns all places",
  },

    findByUser: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const userid = request.auth.credentials._id;
        return await db.placeStore.getUserPlaces(userid);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PlaceArraySpec, failAction: validationError },
    description: "Get all a users places",
    notes: "Returns all a users places based on their userid",
  },

    findByCategory: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const places = await db.placeStore.getPlacesByCategory(request.params.category);
        if (!places) {
          return Boom.badRequest("Invalid place category");
        }
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PlaceArraySpec, failAction: validationError },
    validate: { params: { category: CategorySpec }, failAction: validationError },
    description: "Get all places in a category",
    notes: "Returns all places in a chosen category",
  },

  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const place = await db.placeStore.addPlace(request.payload);
        if (place) {
          return h.response(place).code(201);
        }
        return Boom.badImplementation("error creating place");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Place",
    notes: "Returns the newly created place",
    validate: { payload: PlaceSpec, failAction: validationError },
    response: { schema: PlaceSpecPlus, failAction: validationError },
  },

  findOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No place with this id");
        }
        return place;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get a specific place",
    notes: "Returns place details",
    validate: { params: { id: IdSpec, failAction: validationError }},
    response: { schema: PlaceSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h){
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No place with this id");
        }
        await db.placeStore.deletePlaceById(place._id);
        return h.response().code(204)
      } catch {
      return Boom.serverUnavailable("Database Error")
    }
  },
  tags: ["api"],
  validate: { params: { id: IdSpec }, failAction: validationError },
  description: "Delete all places",
  notes: "All places removed from Placemark",
},

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.placeStore.deleteAllPlaces();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  tags: ["api"],
  description: "Delete all places",
  notes: "All places removed from Placemark",
  },
}
