import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers } from "../fixtures.js";
import { db } from "../../src/models/db.js"

const users = new Array(testUsers.length);

suite("User API tests", () => {
  let user;
  setup(async () => {
    db.init("mongo")
    playtimeService.clearAuth();
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggie);
    await playtimeService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await playtimeService.createUser(testUsers[i]);
    }
    user = await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggie);
    
  });

  teardown(async () => {});

  test("create a user", async () => {
    const newUser = await playtimeService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete one user", async () => {
    const newUser = await playtimeService.createUser(maggie);
    await playtimeService.deleteUser(newUser._id);
    try {
      await playtimeService.getUser(newUser._id);
      assert.fail("Should not return a response")
    } catch (error) {
      assert(error.response.data.message === "No user with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("delete all users", async () => {
    let returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await playtimeService.deleteAllUsers();
    // must reintroduce maggie to be allowed to check original 3 were deleted
    await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggie);
    returnedUsers = await playtimeService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user - success", async () => {
    const returnedUser = await playtimeService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await playtimeService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No user with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a user - deleted user", async () => {
    await playtimeService.deleteAllUsers();
    // must reintroduce maggie to be allowed to check for user
    await playtimeService.createUser(maggie);
    await playtimeService.authenticate(maggie);
    try {
      const returnedUser = await playtimeService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      
      assert(error.response.data.message === "No user with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
