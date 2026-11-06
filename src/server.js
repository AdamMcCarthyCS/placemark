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
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  await server.register([
    Inert,
    Vision,
    Cookie,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    }
  ])

  server.validator(Joi);

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.NAME,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
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
