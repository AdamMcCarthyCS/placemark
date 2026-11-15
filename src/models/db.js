import { connectMongo } from "./mongo/connect.js";
import { placeMongoStore } from "./mongo/place-mongo-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";

export const db = {
  placeStore: null,
  userStore: null,

  // I have only allowed a mongo storetype but have kept the facade pattern in case
  // database api will change in the futer to perhaps postgresql or another database
  init(storeType) {
    if (storeType !== "mongo") {
      throw new Error(`Unsupported database store: ${storeType}`);
    }

    this.placeStore = placeMongoStore;
    this.userStore = userMongoStore;

    connectMongo();
  },
};