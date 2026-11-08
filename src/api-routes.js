import { userApi } from "./api/user-api.js";
import { placeApi } from "./api/place-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: userApi.deleteOne },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "GET", path: "/api/places", config: placeApi.find },
  { method: "POST", path: "/api/places", config: placeApi.create },
  { method: "GET", path: "/api/places/{id}", config: placeApi.findOne },
  { method: "DELETE", path: "/api/places", config: placeApi.deleteAll },
  { method: "DELETE", path: "/api/places/{id}", config: placeApi.deleteOne },
  { method: "GET", path: "/api/places/user/", config: placeApi.findByUser },
  { method: "GET", path: "/api/places/category/{category}", config: placeApi.findByCategory },

  // jwt authenticaiton route
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
];

