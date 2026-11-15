import { db } from "../models/db.js";

export const adminController = {

  info: {
    // this creates an array which is used to populate the admin info page
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (loggedInUser.role !== "admin") {
        return h.response("Forbidden").code(403);
      }

      const users = await db.userStore.getAllUsers(); // array
      const places = await db.placeStore.getAllPlacesWithUser(); // array
      const userCount = users.length; // number of users
      const placeCount = places.length; // number of places
      // create an array where every user is an object containing 
      // first and last name, email, and the places theyve added. This will
      // be iterated over with handlebars to populate the info page
      const usersWithPlaces = users.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        places: places
          // find all places with the users id and discard others
          .filter((place) =>place.userid._id.toString() === user._id.toString())
          // replace each place object's fields with just its name and category fields in an object
          .map((place) => ({name: place.name, category: place.category,}))
          // sort from a-z by category then by name
          // if category is same returns 0 so sorts by name in that case
          // sort algorithm handles ordering by swapping a with b for -1, b with a for 1
          // treats as same for 0
          // sort docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          .sort((a, b) => {
            // omission of braces okay for one line statment
            // https://eslint.org/docs/latest/rules/curly
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0; 
          })
      })
    );
      return h.view("admin-info", {
        title: " Info",
        users: usersWithPlaces,
        totalUserCount: userCount,
        totalPlaceCount: placeCount,
      });
    },
  },
};