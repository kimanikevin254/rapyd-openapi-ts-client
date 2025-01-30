import 'dotenv/config'
import express from "express"
import { AppDataSource } from "./database/data-source"
import passport from 'passport';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import flash from 'connect-flash';
import router from "./router"
import path from 'path';

// Register strategy
import './strategies/local.strategy';

// Initialize SQLite session store
const SQLiteStoreInstance = SQLiteStore(session);

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }));

    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new (SQLiteStoreInstance as any )({
            db: 'database.sqlite',
            dir: './',
            table: 'sessions'
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        }
    }))
    app.use(flash())
    app.use(passport.authenticate('session'))

    app.use('/', router)

    // start express server
    app.listen(3000)

    console.log("Express server is running on port 3000.")

}).catch(error => console.log(error))
