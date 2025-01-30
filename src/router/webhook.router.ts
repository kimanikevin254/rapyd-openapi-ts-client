import { Router } from "express";
import { webhookController } from "../controller/webhook.controller";

const webhookRouter = Router();

webhookRouter.post('/rapyd', webhookController.rapyd)

export default webhookRouter;