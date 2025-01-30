import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Order } from "./order.entity";

export enum PaymentStatus {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

@Entity()
export class Payment extends BaseEntity {
    @OneToOne(() => Order, (order) => order.payment)
    @JoinColumn()
    order: Order;

    @Column({ unique: true, nullable: true })
    rapydCheckoutId: string;

    @Column({ unique: true, nullable: true })
    rapydPaymentId: string;

    @Column("decimal")
    amount: number;

    @Column()
    status: PaymentStatus;
}
