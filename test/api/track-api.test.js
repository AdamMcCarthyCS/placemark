import { assert } from "chai";
import { playtimeService } from "./playtime-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, playlist, track, testTracks } from "../fixtures.js";
import { db } from "../../src/models/db.js"

suite("Track API tests", () => {
  setup(async () => {
    db.init("json")
    await playtimeService.deleteAllTracks();
    await playtimeService.deleteAllPlaylists();
    await playtimeService.deleteAllUsers();
    const user = await playtimeService.createUser(maggie);
    playlist.userid = user._id
    
  });

  teardown(async () => {});

  test("create a track", async () => {
    const newTrack = await playtimeService.createTrack(playlist._id, track);
    assertSubset(track, newTrack);
    assert.isDefined(newTrack._id);
  });

  test("delete all tracks", async () => {
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTracks[i] = await playtimeService.createTrack(playlist._id, testTracks[i]);
    }
    let returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, 3);
    await playtimeService.deleteAllTracks();
    returnedTracks = await playtimeService.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get a track - success", async () => {
    const createdTrack = await playtimeService.createTrack(playlist._id, testTracks[0])
    const returnedTrack = await playtimeService.getTrack(createdTrack._id);
    assert.deepEqual(createdTrack, returnedTrack);
  });

  test("test denormalised playlist", async() => {
    const newPlaylist = await playtimeService.createPlaylist(playlist);
    const newTrack0 = await playtimeService.createTrack(newPlaylist._id, testTracks[0]);
    const newTrack1 = await playtimeService.createTrack(newPlaylist._id, testTracks[1]);
    const returnedPlaylist = await playtimeService.getPlaylist(newPlaylist._id);
    assert.equal(returnedPlaylist.tracks[0].title, newTrack0.title);
    assert.equal(returnedPlaylist.tracks[1].title, newTrack1.title);
    assert.equal(returnedPlaylist.tracks[0].artist, newTrack0.artist);
    assert.equal(returnedPlaylist.tracks[1].artist, newTrack1.artist);
    assert.equal(returnedPlaylist.tracks[0].duration, newTrack0.duration);
    assert.equal(returnedPlaylist.tracks[1].duration, newTrack1.duration);
    assert.equal(returnedPlaylist.tracks[0]._id, newTrack0._id);
    assert.equal(returnedPlaylist.tracks[1]._id, newTrack1._id);
    assert.equal(returnedPlaylist.tracks.length, 2);
  })

  test("get a track - bad id", async () => {
    try {
      const returnedTrack = await playtimeService.getTrack("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Track with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a track - deleted track", async () => {
    await playtimeService.deleteAllTracks();
    try {
      const returnedTrack = await playtimeService.getTrack(testTracks[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Track with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});
