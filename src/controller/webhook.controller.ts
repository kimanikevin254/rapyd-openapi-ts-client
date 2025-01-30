import { NextFunction, Request, Response } from "express";
import { validateRapydWebhook } from "../utils/validateRapydWebhook";
import { AppDataSource } from "../database/data-source";
import { Payment, PaymentStatus } from "../database/entity/payment.entity";
import { Order, OrderStatus } from "../database/entity/order.entity";

class WebhookController {
    private paymentRepository = AppDataSource.getRepository(Payment);
    private orderRepository = AppDataSource.getRepository(Order);

    rapyd = async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!validateRapydWebhook(req)) { return; }

            if (req.body.type !== "PAYMENT_COMPLETED") { return; }

            const completePaymentUrl: string = req.body.data.complete_payment_url;
            const rapydCheckoutId: string = completePaymentUrl.split('/')[completePaymentUrl.split('/').length]
            const rapydPaymentId: string = req.body.data.id;

            // Retrieve payment
            const payment = await this.paymentRepository.findOne({ where: { rapydCheckoutId, status: PaymentStatus.PENDING }, relations: ['order'] });

            if (!payment) { return; }

            // Update payment with the Rapyd payment ID
            await this.paymentRepository.update(payment.id, { rapydPaymentId, status: PaymentStatus.COMPLETED })

            // Mark order as COMPLETED
            await this.orderRepository.update(payment.order.id, { status: OrderStatus.COMPLETED });
            console.log('Updated order');
        } catch (error) {
            console.log(error);
            next(error);
        }
    } 
}

export const webhookController = new WebhookController();