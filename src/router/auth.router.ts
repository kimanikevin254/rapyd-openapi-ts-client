import { Router } from "express";
import passport from "passport";
import { authController } from "../controller/auth.controller";
import { ensureLoggedOut } from "connect-ensure-login";

const authRouter = Router();

authRouter.get('/signup', ensureLoggedOut({ redirectTo: '/' }), (req, res) => {
    const error = req.flash('error');
    res.render('pages/auth/signup', { error: error.length ? error[0] : null });
});

authRouter.post('/signup', authController.register);

authRouter.get('/login', ensureLoggedOut({ redirectTo: '/' }), (req, res) => {
    const error = req.flash('error'); // Retrieve the flash error message
    res.render('pages/auth/login', { error: error.length ? error[0] : null });
});

authRouter.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}))

authRouter.get('/logout', authController.logout)

export default authRouter;