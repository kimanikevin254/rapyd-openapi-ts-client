import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import { productController } from "../controller/product.controller";

const productRouter = Router();

productRouter.get('/', ensureLoggedIn({ redirectTo: '/auth/login' }), productController.findAll)
productRouter.get('/products/:id', ensureLoggedIn({ redirectTo: '/auth/login' }), productController.productDetails)

export default productRouter;