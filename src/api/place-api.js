import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const placeApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const places = await db.placeStore.getAllPlaces();
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

    findByUser: {
    auth: false,
    handler: async function (request, h) {
      try {
        return await db.placeStore.getUserPlaces(request.params.userid);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

    findByCategory: {
    auth: false,
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
  },

  create: {
    auth: false,
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
  },

  findOne: {
    auth: false,
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
  },

  deleteOne: {
    auth: false,
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
},

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.placeStore.deleteAllPlaces();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
}
