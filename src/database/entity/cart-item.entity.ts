import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity()
export class CartItem extends BaseEntity {    
    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.id)
    product: Product;

    @Column()
    quantity: number;
}
