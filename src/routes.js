import { Router } from "express";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMiddleware from "./app/middlewares/auth";
import StudentController from "./app/controllers/StudentController";
import PlanController from "./app/controllers/PlanController";
import RegistrationController from "./app/controllers/RegistrationController";
import CheckinController from "./app/controllers/CheckinController";
import HelpOrderController from "./app/controllers/HelpOrderController";
import AnswerOrderController from "./app/controllers/AnswerOrderController";

const routes = new Router();

//This routes does not requires authentication.

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.get("/students/:id", StudentController.show);

//Check in routes
routes.post("/students/:id/checkins", CheckinController.store);
routes.get("/students/:id/checkins", CheckinController.index);

//Question routes

routes.post("/students/:id/help-orders", HelpOrderController.store);
routes.get("/students/:id/help-orders", HelpOrderController.show);
routes.get("/students/help-orders", HelpOrderController.index);

routes.use(authMiddleware);
//This routes requires authentication.

routes.put("/users", UserController.update);

routes.get("/students/", StudentController.index);
routes.post("/students", StudentController.store);
routes.put("/students/:id", StudentController.update);
routes.delete("/students/:id", StudentController.destroy);

//Plans Routes
routes.post("/plans", PlanController.store);
routes.put("/plans/:id", PlanController.uptade);
routes.delete("/plans/:id", PlanController.destroy);
routes.get("/plans", PlanController.index);

//Registration Routes

routes.get("/registrations", RegistrationController.index);
routes.post("/registrations", RegistrationController.store);
routes.put("/registrations/:id", RegistrationController.update);
routes.delete("/registrations/:id", RegistrationController.destroy);

//Question-Answers
routes.post("/help-orders/:id/answer", AnswerOrderController.store);
routes.get("/help-orders", AnswerOrderController.index);

export default routes;
