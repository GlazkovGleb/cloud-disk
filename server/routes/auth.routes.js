import { Router } from "express";
import { check } from "express-validator";
import UserController from "../controllers/UserController.js";
import authMiddleware from '../middleware/auth.middleware.js'

const router = new Router()

router.post('/registration',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 12').isLength({ min: 3, max: 12 })
    ],
    UserController.register)

router.post('/login',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Not get password').notEmpty()
    ],
    UserController.login)

router.get('/auth_by_token',
    authMiddleware,
    UserController.loginByToken)

export default router