import { assert } from "chai";

export function assertSubset(subset, superset) {
  // If subset is null/undefined, it's only a subset if superset is also null/undefined
  if (subset === null || subset === undefined) {
    return superset === null || superset === undefined;
  }

  // If subset is a primitive, compare directly
  if (typeof subset !== "object") {
    if (typeof superset?.toHexString === "function" && typeof subset === "string") {
      return subset === superset.toHexString();
    }
    return subset === superset;
  }

  // If subset is an object but superset is not, they can't match
  if (typeof superset !== "object" || superset === null) {
    return false;
  }

  // Handle Date objects - both must be Dates with equal values
  if (subset instanceof Date) {
    return superset instanceof Date && subset.valueOf() === superset.valueOf();
  }

  // Handle arrays - every element in subset must exist in superset
  if (Array.isArray(subset)) {
    if (!Array.isArray(superset)) {
      return false;
    }
    // For each element in subset, find a matching element in superset
    return subset.every((subsetItem) => superset.some((supersetItem) => assertSubset(subsetItem, supersetItem)));
  }

  // Handle objects - every key-value pair in subset must exist in superset
  return Object.keys(subset).every((key) => {
    // Key must exist in superset
    if (!(key in superset)) {
      assert.fail(`Key ${key} not found in superset`);
      return false;
    }

    const subsetValue = subset[key];
    const supersetValue = superset[key];

    // Recurse for nested values so arrays and objects compare by contents.
    if (subsetValue !== null && typeof subsetValue === "object") {
      assert.isTrue(assertSubset(subsetValue, supersetValue));
      return true;
    }
    if (typeof supersetValue?.toHexString === "function" && typeof subsetValue === "string") {
      assert.equal(subsetValue, supersetValue.toHexString());
      return true;
    }
    assert.equal(subsetValue, supersetValue);
    return true;
  });
}
