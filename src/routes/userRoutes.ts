import { Router } from "express";
import { userLogin, userSignup, varifyUserEmail } from "../controller/userController";

export const userRoutes = Router()

userRoutes.post('/signup',userSignup)
// userRoutes.post('/email-verification',varifyUserEmail)
// userRoutes.post('login',userLogin)