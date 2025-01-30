import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Payment, PaymentStatus } from "../database/entity/payment.entity";
import { Order, OrderStatus } from "../database/entity/order.entity";

class WebhookController {
    private paymentRepository = AppDataSource.getRepository(Payment);
    private orderRepository = AppDataSource.getRepository(Order);

    rapyd = async (req: Request, res: Response, next: NextFunction) => {
        
    } 
}

export const webhookController = new WebhookController();