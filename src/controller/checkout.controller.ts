import { NextFunction, Request, Response } from "express";
import ejs from 'ejs';
import { AppDataSource } from "../database/data-source";
import { Order, OrderStatus } from "../database/entity/order.entity";
import { User } from "../database/entity/user.entity";
import { Payment, PaymentStatus } from "../database/entity/payment.entity";
import { CheckoutPageApi, Configuration } from "../../rapyd-client";
import { signRequest } from "../utils/signRapydRequest";
import { Cart } from "../database/entity/cart.entity";

class CheckoutController {
    private orderRepository = AppDataSource.getRepository(Order);
    private paymentRepository = AppDataSource.getRepository(Payment);
    private cartRepository = AppDataSource.getRepository(Cart);
    
    private config = new Configuration({});
    private checkoutPageApi = new CheckoutPageApi(this.config) ;

    index = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const pageContent = await ejs.renderFile('src/views/pages/checkout/index.ejs');

            res.render('layouts/main', {
                title: 'Checkout',
                content: pageContent,
            });
        } catch (error) {
            next(error)
        }
    }

    success = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const pageContent = await ejs.renderFile('src/views/pages/checkout/success.ejs');

            res.render('layouts/main', {
                title: 'Success',
                content: pageContent,
            });
        } catch (error) {
            next(error)
        }
    }

    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cartId } = req.query;

            if (!cartId) { throw new Error('Missing cart ID') }

            // Retrieve cart
            const cart = await this.cartRepository.findOne({ where: { id: cartId as string } });
            
            if (!cart) { throw new Error('Invalid cart ID') }

            // Create order using cart details
            const order = this.orderRepository.create({
                user: req.user as User,
                cart: cart,
                status: OrderStatus.PENDING,
                totalAmount: cart.totalAmount
            });

            await this.orderRepository.save(order);

            // Create a payment for the order
            const payment = this.paymentRepository.create({
                order: order,
                status: PaymentStatus.PENDING,
                amount: order.totalAmount,
            });

            await this.paymentRepository.save(payment);

            // Update order with the payment
            order.payment = payment;
            await this.orderRepository.save(order);

            // Generate a checkout page
            const rapydRequestBody = { 
                amount: order.totalAmount, 
                country: 'IT', 
                currency: "USD", 
                complete_checkout_url: `${process.env.BASE_URI}/checkout/success`, 
                cancel_checkout_url: `${process.env.BASE_URI}/cart`, 
                payment_method_type: "it_visa_card",
            };

            const { salt, timestamp, signature, idempotency } = signRequest("POST", "/v1/checkout", JSON.stringify(rapydRequestBody));

            const { data } = await this.checkoutPageApi.generateHostedPagePayment(
                process.env.RAPYD_ACCESS_KEY,
                'application/json',
                salt,
                signature,
                timestamp,
                idempotency,
                rapydRequestBody
            )

            // Update payment with the Rapyd checkout ID
            await this.paymentRepository.update(payment.id, { rapydCheckoutId: data.data.id });

            // Redirect user to payment page
            res.json({ success: true, paymentPageUrl: data.data.redirect_url })
        } catch (error) {
            next(error);
        }
    }
    
}

export const checkoutController = new CheckoutController();