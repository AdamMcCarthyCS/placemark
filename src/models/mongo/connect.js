import * as dotenv from "dotenv";
import Mongoose from "mongoose";
import * as mongooseSeeder from "mais-mongoose-seeder";
import { seedData, adminSeedData } from "./seed-data.js";
import { User } from "./user.js";

const seedLib = mongooseSeeder.default;

async function seed() {
  const seeder = seedLib(Mongoose);
  const dbData = await seeder.seed(seedData, { dropDatabase: false, dropCollections: true });
  console.log(dbData);
}


async function adminSeed() {
  // mongoose exists function https://mongoosejs.com/docs/api/model.html#Model.exists()
  const adminExists = await User.exists({ email: "admin@example.com" });
  if (!adminExists) {
    const seeder = seedLib(Mongoose);
    await seeder.seed(adminSeedData, { dropDatabase: false, dropCollections: false });
  }
}

export function connectMongo() {
  dotenv.config();

  Mongoose.set("strictQuery", true);
  Mongoose.connect(process.env.db);
  const db = Mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
    adminSeed();
    // allow seeding for demonstration purposes
    // seed();
  });
}
