import { ensureLoggedIn } from "connect-ensure-login";
import { Router } from "express";
import { checkoutController } from "../controller/checkout.controller";

const checkoutRouter = Router();

checkoutRouter.get('/', ensureLoggedIn({ redirectTo: '/auth/login' }), checkoutController.index);
checkoutRouter.get('/create-order', ensureLoggedIn({ redirectTo: '/auth/login' }), checkoutController.createOrder)
checkoutRouter.get('/success', checkoutController.success)

export default checkoutRouter;