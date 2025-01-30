import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/user.entity"
import { Product } from "./entity/product.entity"
import { Cart } from "./entity/cart.entity"
import { CartItem } from "./entity/cart-item.entity"
import { Order } from "./entity/order.entity"
import { Payment } from "./entity/payment.entity"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Product, Cart, CartItem, Order, Payment],
    migrations: [],
    subscribers: [],
})
