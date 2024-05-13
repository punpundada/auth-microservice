import { Router } from "express";
import { userSignup } from "../controller/userController";

const userRoutes = Router()

userRoutes.post('/signup',userSignup)