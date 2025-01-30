import axios from "axios";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/product.entity";

const seedProducts = async () => {
    try {
        console.log('Coonecting to the database...');
        const dataSource = await AppDataSource.initialize();

        console.log('Fetching product data from DummyJSON(https://dummyjson.com/docs/products)...');
        const { data } = await axios.get('https://dummyjson.com/products?limit=10');

        if (!data.products || !data.products.length) {
            console.log('No products found in the API renspose.');
            return;
        }

        console.log('Seeding products...');
        const products = data.products.map((product: any) => {
            const newProduct = new Product()
            newProduct.name = product.title;
            newProduct.price = parseFloat(product.price);
            newProduct.description = product.description;
            newProduct.imageUrl = product.thumbnail;
            return newProduct;
        })

        await dataSource.getRepository(Product).save(products);

        console.log(`${products.length} products seeded successfully.`);
        await dataSource.destroy()
    } catch (error) {
        console.error("Error seeding products:", error);
    }
}

seedProducts();