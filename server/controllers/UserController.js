import UserServise from "../Servises/UserServise.js";
import { validationResult } from "express-validator";

class UserController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Uncorrect request', errors })
            }
            const { email, password } = req.body
            await UserServise.create(email, password)
            res.status(201).json({ message: 'Поздравляю Вы успешно зарегистрировались!' })
        } catch (e) {
            console.log(e);
            res.status(e.status || 500).json({ message: e.message })
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Uncorrect request', errors })
            }
            const { email, password } = req.body
            const data = await UserServise.get(email, password)
            res.json(data)
        } catch (e) {
            res.status(e.status || 500).json({ message: e.message })
        }
    }

    async loginByToken(req, res) {
        try {
            const data = await UserServise.getById(req.user.id)
            res.json(data)
        } catch (e) {
            res.status(e.status || 500).json({ message: e.message })
        }
    }

}

export default new UserController()