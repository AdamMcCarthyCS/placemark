import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, place, testPlaces } from "../fixtures.js";
import { db } from "../../src/models/db.js"

const places = Array(testPlaces.length);

suite("Place API tests", () => {
  let userId;
  let user;
  setup(async () => {
    playtimeService.clearAuth();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggie);
    await playtimeService.deleteAllPlaces();
    await playtimeService.deleteAllUsers();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggie);
    userId = user._id
    place.userid = user._id
  });

  teardown(async () => {});

  test("create a place", async () => {
    const newPlace = await playtimeService.createPlace(place);
    assertSubset(place, newPlace);
    assert.isDefined(newPlace._id);
  });

  test("get a place - success", async () => {
    const originalPlace = await playtimeService.createPlace(place);
    const returnedPlace = await playtimeService.getPlace(originalPlace._id);
    assertSubset(originalPlace, returnedPlace);
  });

  test("delete one place", async () => {
    const newPlace = await playtimeService.createPlace(place);
    await playtimeService.deletePlace(newPlace._id);
    try {
      await playtimeService.getPlace(newPlace._id);
      assert.fail("Should not return a response")
    } catch (error) {
      assert(error.response.data.message === "No place with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("delete all places", async () => {
    for (let i = 0; i < testPlaces.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      places[i] = await playtimeService.createPlace(testPlaces[i]);
    }
    let returnedPlaces = await playtimeService.getAllPlaces();
    assert.equal(returnedPlaces.length, 3);
    await playtimeService.deleteAllPlaces();
    returnedPlaces = await playtimeService.getAllPlaces();
    assert.equal(returnedPlaces.length, 0);
  });

  test("get places by user", async () => {
  for (let i = 0; i < testPlaces.length; i += 1) {
    const newPlace = { ...testPlaces[i], userid: userId };
    // eslint-disable-next-line no-await-in-loop
    places[i] = await playtimeService.createPlace(newPlace);
  }

  const returnedPlaces = await playtimeService.getPlacesByUser(userId);
  assert.equal(returnedPlaces.length, 3);
});

  test("get places by category", async () => {
    for (let i = 0; i < testPlaces.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      places[i] = await playtimeService.createPlace(testPlaces[i]);
      places[i].userid = maggie._id
    }
    const returnedPlaces = await playtimeService.getPlacesCategory("Landmark");
    assert.equal(returnedPlaces.length, 2);
  });

  test("get a place bad id - fail", async () => {
    try {
      const returnedPlace = await playtimeService.getPlace("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No place with this id");
    }
  });

  test("get a place deleted place fail", async () => {
    await playtimeService.deleteAllPlaces();
    try {
      const returnedPlace = await playtimeService.getPlace(testPlaces[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
});

