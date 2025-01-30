import { Entity, ManyToOne, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Payment } from "./payment.entity";
import { Cart } from "./cart.entity";

export enum OrderStatus {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

@Entity()
export class Order extends BaseEntity {
    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToOne(() => Payment, (payment) => payment.order)
    payment: Payment;

    @OneToOne(() => Cart, (cart) => cart.order)
    @JoinColumn()
    cart: Cart;

    @Column()
    status: OrderStatus;

    @Column("decimal")
    totalAmount: number;
}
