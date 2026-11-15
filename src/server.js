import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import Inert from "@hapi/inert"
import Cookie from "@hapi/cookie";
import HapiSwagger from "hapi-swagger"
import dotenv from "dotenv";
import Joi from "joi";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  info: {
    title: "Playtime API",
    version: "0.1"
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

async function init() {
  const server = Hapi.server({
    port: process.env.port,
    host: "0.0.0.0",
  });

  await server.register([
    Inert,
    Vision,
    Cookie,
    jwt,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    }
  ])

  server.validator(Joi);

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });

    server.auth.strategy("jwt", "jwt", {
      key: process.env.cookie_password,
      validate: validate,
      verifyOptions: { algorithms: ["HS256"] }
  });

  server.auth.default("session");

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  db.init("mongo");

  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
