import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Product extends BaseEntity {
    @Column()
    name: string;

    @Column("decimal")
    price: number;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrl: string;
}
