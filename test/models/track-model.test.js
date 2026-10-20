import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testTracks, track, playlist } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Track Model Tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.trackStore.deleteAllTracks();
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTracks[i] = await db.trackStore.addTrack(playlist._id, testTracks[i]);
    }
  });

  test("create a track", async () => {
    const newTrack = await db.trackStore.addTrack(playlist._id, track);
    assertSubset(track, newTrack);
    assert.isDefined(newTrack._id);
  });

  test("delete all tracks", async () => {
    let returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 3);
    await db.trackStore.deleteAllTracks();
    returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get multiple tracks", async () => {
    const tracks = await db.trackStore.getTracksByPlaylistId(playlist._id);
    assert.equal(tracks.length, testTracks.length);
  });

  test("get a track - success", async () => {
    const newTrack = await db.trackStore.addTrack(playlist._id, track);
    const returnedTrack = await db.trackStore.getTrackById(newTrack._id);
    assertSubset(track, newTrack);
  });

  test("delete One Track - success", async () => {
    const id = testTracks[0]._id;
    await db.trackStore.deleteTrack(id);
    const returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length - 1);
    const deletedTrack = await db.trackStore.getTrackById(id);
    assert.isNull(deletedTrack);
  });

  test("get a track - bad params", async () => {
    assert.isNull(await db.trackStore.getTrackById(""));
    assert.isNull(await db.trackStore.getTrackById());
  });

  test("delete One Track - fail", async () => {
    await db.trackStore.deleteTrack("bad-id");
    const allTracks = await db.trackStore.getAllTracks();
    assert.equal(testTracks.length, allTracks.length);
  });
});
