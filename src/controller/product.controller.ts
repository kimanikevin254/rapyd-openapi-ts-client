import { AppDataSource } from "../database/data-source"
import type { NextFunction, Request, Response } from "express"
import { Product } from "../database/entity/product.entity"
import ejs from 'ejs';

class ProductController {

    private productRepository = AppDataSource.getRepository(Product)

    findAll = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await this.productRepository.find({ select: { id: true, imageUrl: true, name: true, price: true } });
            // res.render('pages/index', { products })
            
            const pageContent = await ejs.renderFile('src/views/pages/index.ejs', {
                products
            })

            res.render('layouts/main', {
                title: 'Home',
                content: pageContent
            })
        } catch (error) {
            next(error)
        }
    }
    
    productDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;

            const product = await this.productRepository.findOne({ where: { id: productId } });

            if (!product) {
                // Show error page
            }

            const pageContent = await ejs.renderFile('src/views/pages/product/details.ejs', { product })

            res.render('layouts/main', {
                title: product.name,
                content: pageContent
            });
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController()