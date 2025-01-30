import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { CartItem } from "./cart-item.entity";
import { Order } from "./order.entity";

@Entity()
export class Cart extends BaseEntity {
    @ManyToOne(() => User, (user) => user.carts)
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems: CartItem[];

    @OneToOne(() => Order, (order) => order.cart)
    order: Order;

    @Column("decimal", { nullable: true })
    totalAmount: number;
}
