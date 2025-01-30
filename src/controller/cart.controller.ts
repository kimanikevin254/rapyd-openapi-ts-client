import { AppDataSource } from "../database/data-source";
import ejs from 'ejs';
import { Cart } from "../database/entity/cart.entity";
import { NextFunction, Request, Response } from "express";
import { CartItem } from "../database/entity/cart-item.entity";
import { User } from "../database/entity/user.entity";
import { Product } from "../database/entity/product.entity";

class CartController {
    private cartRepository = AppDataSource.getRepository(Cart);
    private cartItemRepository = AppDataSource.getRepository(CartItem);
    private productRepository = AppDataSource.getRepository(Product);

    index = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const pageContent = await ejs.renderFile('src/views/pages/cart/index.ejs');

            res.render('layouts/main', {
                title: 'Cart',
                content: pageContent,
            });
        } catch (error) {
            next(error)
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cartItems: { id: string, quantity: number }[] = req.body;
            const user = req.user as User;

            // Create a new cart for the user
            const cart = this.cartRepository.create({ user });
            await this.cartRepository.save(cart);

            // Calculate totoal amount
            let totalAmount = 0;

            // Fetch products and save the cart items
            const cartItemsPromises = cartItems.map(async (item) => {
                const product = await this.productRepository.findOne({ where: { id: item.id } });
                if (!product) return;

                const carItem = new CartItem();
                carItem.cart = cart;
                carItem.product = product;
                carItem.quantity = item.quantity;

                // Calculate subtotal for this item and add to total amount
                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;

                await this.cartItemRepository.save(carItem);
            })

            await Promise.all(cartItemsPromises);

            // Update cart with total amount
            cart.totalAmount = totalAmount;
            await this.cartRepository.save(cart);

            res.json({ success: true, cartId: cart.id });
        } catch (error) {
            next(error);
        }
    }
}

export const cartController = new CartController();