import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { place, testPlaces, maggie } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Place Model Tests", () => {
  const newPlaces = Array[testPlaces.length]
  

  setup(async () => {
    db.init("mongo");
    const user = await db.userStore.addUser(maggie);
    const userId = user._id;

    place.userid = userId;
    testPlaces.forEach((testPlace) => {
      testPlace.userid = userId;
    }); 

    await db.placeStore.deleteAllPlaces();
    for (let i = 0; i < testPlaces.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.placeStore.addPlace(testPlaces[i]);
    }
  });

  test("create a place", async () => {
    const newPlace = await db.placeStore.addPlace(place);
    // side effect of displaying user names with places on dashboard
    // the mongoose populate method is called on getPlacesById in addPlace
    // hence the test must be modified to suit the return type
    // in this program flow
    assertSubset(
      {
        ...place,
        userid: {
          _id: place.userid,
          firstName: maggie.firstName,
          lastName: maggie.lastName,
        },
      },
      newPlace,
    );
  });

  test("get all places", async () => {
    const returnedPlaces = await db.placeStore.getAllPlaces();
    assert.equal(returnedPlaces.length, 3);
  });

  test("get user places - exists", async () => {
    const userid = await testPlaces[0].userid;
    const userTestPlaces = await db.placeStore.getUserPlaces(userid);
    assert.equal(userTestPlaces.length, 3);
  });

  test("delete all places", async () => {
    let returnedPlaces = await db.placeStore.getAllPlaces();
    assert.equal(returnedPlaces.length, 3);
    await db.placeStore.deleteAllPlaces();
    returnedPlaces = await db.placeStore.getAllPlaces();
    assert.equal(returnedPlaces.length, 0);
  });

  test("get a place - success", async () => {
    const addedPlace = await db.placeStore.addPlace(place);
    const returnedPlace1 = await db.placeStore.getPlaceById(addedPlace._id);
    assert.deepEqual(addedPlace, returnedPlace1);
  });

  test("get a place - failure", async () => {
    const noPlaceWithId = await db.placeStore.getPlaceById("doesnt exist");
    assert.isNull(noPlaceWithId);
  });

  test("get user places - failure", async () => {
    const nonExistingPlace = await db.placeStore.getUserPlaces("0123456789abcdef01234567");
    console.log(nonExistingPlace);
    assert.isEmpty(nonExistingPlace);
  });

  test("get a place - bad params", async () => {
    let nullPlace = await db.placeStore.getPlaceById("");
    assert.isNull(nullPlace);
    nullPlace = await db.placeStore.getPlaceById();
    assert.isNull(nullPlace);
  });

  test("delete one place - fail", async () => {
    await db.placeStore.deletePlaceById("doesnt exist");
    const afterDeletionPlaces = await db.placeStore.getAllPlaces();
    assert.equal(testPlaces.length, afterDeletionPlaces.length);
  });
});
