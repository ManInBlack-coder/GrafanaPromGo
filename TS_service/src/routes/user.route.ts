import Router from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post('/register', UserController.registerUser);
userRoutes.get('/',  UserController.getAllUsers);

export default userRoutes;