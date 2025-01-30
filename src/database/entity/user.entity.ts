import { Entity, Column, OneToMany } from "typeorm"
import { BaseEntity } from "./base.entity"
import { Cart } from "./cart.entity";
import { Order } from "./order.entity";

@Entity()
export class User extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
