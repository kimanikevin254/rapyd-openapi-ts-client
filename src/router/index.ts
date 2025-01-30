import { Router } from "express";
import authRouter from "./auth.router";
import productRouter from "./product.router";
import cartRouter from "./cart.router";
import checkoutRouter from "./checkout.router";
import webhookRouter from "./webhook.router";

const router = Router();

router.use('/', productRouter)
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter)
router.use('/webhook', webhookRouter);

export default router;