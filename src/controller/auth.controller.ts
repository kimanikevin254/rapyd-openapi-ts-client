import { AppDataSource } from "../database/data-source"
import type { NextFunction, Request, Response } from "express"
import { User } from "../database/entity/user.entity"
import * as bcrypt from 'bcrypt';
import ejs from 'ejs';

class AuthController {

    private userRepository = AppDataSource.getRepository(User)

    findUserBy(criteria: 'email' | 'id', value: string) {
        const whereClause = { [criteria]: value };
        return this.userRepository.findOne({ where: whereClause });
    }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password }: { name: string; email: string; password: string } = req.body;

            if (!name || !email || !password) {
                const pageContent = await ejs.renderFile('src/views/pages/auth/signup.ejs', { error: 'Please fill out all the required fields.' });
                
                res.render('layouts/main', {
                    title: 'Sign Up',
                    content: pageContent,
                });

                return;
            }

            if (password.length < 6) {
                const pageContent = await ejs.renderFile('src/views/pages/auth/signup.ejs', { error: 'Password should be more than 6 characters.' });
                
                res.render('layouts/main', {
                    title: 'Sign Up',
                    content: pageContent,
                });

                return;
            }
    
            // Check if user exists
            const user = await this.findUserBy('email', email);
    
            if (user) {
                const pageContent = await ejs.renderFile('src/views/pages/auth/signup.ejs', { error: 'Email address is already registered.' });
                
                res.render('layouts/main', {
                    title: 'Sign Up',
                    content: pageContent,
                });

                return;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Create and save user
            const newUser = this.userRepository.create({ name, email, password: hashedPassword });
            await this.userRepository.save(newUser);
    
            // Log in the user immediately
            req.login(newUser, (err) => {
                if (err) {
                    return next(err);
                }

                // Redirect to homepage
                res.redirect('/')
            })
        } catch (error) {
            // Pass the error to the next middleware
            next(error);
        }
    };
    
    logout = (req: Request, res: Response, next: NextFunction) => {
        try {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                req.session.destroy(() => {
                    res.redirect('/auth/login');
                });
            });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController()