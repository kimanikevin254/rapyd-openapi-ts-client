import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import { cartController } from "../controller/cart.controller";

const cartRouter = Router();

cartRouter.get('/', ensureLoggedIn({ redirectTo: '/auth/login' }), cartController.index)
cartRouter.post('/', ensureLoggedIn({ redirectTo: '/auth/login' }), cartController.create)

export default cartRouter;