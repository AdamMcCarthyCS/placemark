import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { mainController } from "./controllers/main-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { placeController } from "./controllers/place-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/dashboard/private", config: dashboardController.index },
  { method: "GET", path: "/dashboard/public", config: dashboardController.publicDashboard},
  { method: "GET", path: "/about", config: aboutController.index },

  { method: "POST", path: "/dashboard/addplace", config: dashboardController.addPlace },
  { method: "GET", path: "/place/{id}",config: placeController.details },
  { method: "GET", path: "/place/{id}/deletePlace", config: placeController.deletePlace },
  { method: "POST", path: "/place/{id}/editPlace", config: placeController.editPlace },
  { method: "GET", path: "/place/{id}/editPlace", config: placeController.showEditPlace },

  { method: "GET", path: "/admin/info", config: adminController.info },

  // allow wildcards to support image names
  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }

];
