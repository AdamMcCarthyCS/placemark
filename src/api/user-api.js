import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { UserArray, UserSpec, UserSpecPlus, UserCredentialSpec, IdSpec, JwtAuth } from "../models/joi-schemas.js";
import { validationError } from "./logger.js"
import { createToken } from "./jwt-utils.js";


export const userApi = {
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(
          {
            ...request.payload,
            // the purpose of adding role here is so user cannot add thier own role
            // therefore admin must be seeded.
            role: "user"
          });
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all users",
    notes: "Returns details of all userApi",
    response: { schema: UserArray, failAction: validationError }
  },

  /*
  in second iteration of this I will allow admin only use
  as this returns private info such as email. Password will also be hashed
  second time around
  */
  findOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No user with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: { params: { id: IdSpec, failAction: validationError }},
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  // In second iteration of app admin/owner only deletion will be allowed
  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h){
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No user with this id");
        }
        await db.userStore.deleteUserById(user._id);
        return h.response().code(204)
      } catch {
      return Boom.serverUnavailable("Database Error")
      }
    },
    tags: ["api"],
    validate: { params: { id: IdSpec, failAction: validationError }},
    description: "Delete one user",
    notes: "One user removed from Placemark using their id",
  },

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "All users removed from Placemark",
  },

  // jwt authentication handler
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    notes: "If user has valid email/password, create and return a JWT token",
    validate: { payload: UserCredentialSpec, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError },
  },

};
