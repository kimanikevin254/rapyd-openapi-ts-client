import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entity/user.entity';
import bcrypt from 'bcrypt';

passport.use('local', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' }, 
    async (email: string, password: string, done) => {
        try {
            // Retrieve user from the db
            const user = await AppDataSource.getRepository(User).findOne({ where: { email } })

            if (!user) {
                return done(null, false, { message: 'Incorrect credentials' })
            }

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return done(null, false, { message: 'Invalid credentials' })
            }

            return done(null, user)
        } catch (error) {
            return done(error);
        }
    }
))

// Session management
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})