import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, playlist, testPlaylists } from "../fixtures.js";
import { db } from "../../src/models/db.js"

suite("Playlist API tests", () => {
  setup(async () => {
    db.init("json")
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllUsers();
    const user = await playtimeService.createUser(maggie);
    playlist.userid = user._id
  });

  teardown(async () => {});

  test("create a playlist", async () => {
    const newPlaylist = await playtimeService.createPlaylist(playlist);
    assertSubset(playlist, newPlaylist);
    assert.isDefined(newPlaylist._id);
  });

  test("get a playlist - success", async () => {
    const originalPlaylist = await playtimeService.createPlaylist(playlist);
    const returnedPlaylist = await playtimeService.getPlaylist(originalPlaylist._id);
    assertSubset(originalPlaylist, returnedPlaylist);
  });

  test("delete one playlist", async () => {
    const newPlaylist = await playtimeService.createPlaylist(playlist);
    await playtimeService.deletePlaylist(newPlaylist._id);
    try {
      await playtimeService.getPlaylist(newPlaylist._id);
      assert.fail("Should not return a response")
    } catch (error) {
      assert(error.response.data.message === "No playlist with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("delete all playlists", async () => {
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlaylists[i] = await playtimeService.createPlaylist(testPlaylists[i]);
    }
    let returnedPlaylists = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
    await playtimeService.deleteAllPlaylists();
    returnedPlaylists = await playtimeService.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 0);
  });

  test("get a playlist bad id - fail", async () => {
    try {
      const returnedPlaylist = await playtimeService.getPlaylist("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No playlist with this id");
    }
  });

  test("get a playlist deleted playlist fail", async () => {
    await playtimeService.deleteAllPlaylists();
    try {
      const returnedPlaylist = await playtimeService.getPlaylist(testPlaylists[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.status, 404);
    }
  });
});
