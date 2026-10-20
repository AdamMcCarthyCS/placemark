import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { playlist, testPlaylists } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Playlist Model Tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.playlistStore.deleteAllPlaylists();
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlaylists[i] = await db.playlistStore.addPlaylist(testPlaylists[i]);
    }
  });

  test("create a playlist", async () => {
    const newPlaylist = await db.playlistStore.addPlaylist(playlist);
    assertSubset(playlist, newPlaylist);
  });

  test("get all playlists", async () => {
    const returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
  });

  test("get user playlists - exists", async () => {
    const userid = await testPlaylists[0].userid;
    const userTestPlaylists = await db.playlistStore.getUserPlaylists(userid);
    assert.equal(userTestPlaylists.length, 3);
  });

  test("delete all playlists", async () => {
    let returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
    await db.playlistStore.deleteAllPlaylists();
    returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 0);
  });

  test("get a playlist - success", async () => {
    const addedPlaylist = await db.playlistStore.addPlaylist(playlist);
    const returnedPlaylist1 = await db.playlistStore.getPlaylistById(addedPlaylist._id);
    assert.deepEqual(addedPlaylist, returnedPlaylist1);
  });

  test("get a playlist - failure", async () => {
    const noPlaylistWithId = await db.playlistStore.getPlaylistById("doesnt exist");
    assert.isNull(noPlaylistWithId);
  });

  test("get user playlists - failure", async () => {
    const nonExistingPlaylist = await db.playlistStore.getUserPlaylists("0123456789abcdef01234567");
    console.log(nonExistingPlaylist);
    assert.isEmpty(nonExistingPlaylist);
  });

  test("get a playlist - bad params", async () => {
    let nullPlaylist = await db.playlistStore.getPlaylistById("");
    assert.isNull(nullPlaylist);
    nullPlaylist = await db.playlistStore.getPlaylistById();
    assert.isNull(nullPlaylist);
  });

  test("delete one playlist - fail", async () => {
    await db.playlistStore.deletePlaylistById("doesnt exist");
    const afterDeletionPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(testPlaylists.length, afterDeletionPlaylists.length);
  });
});
