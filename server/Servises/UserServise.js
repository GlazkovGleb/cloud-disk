import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from "config"

import User from "../models/User.js"
import CustomError from '../utils/errors.js'
import FileServise from './FileServise.js'
import File from '../models/File.js'


class UserServer {
    async create(email, password) {
        const candidate = await User.findOne({ email })
        if (candidate) {
            throw new CustomError(`Пользователь с email ${email} уже существует!`, 409)
        }

        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({ email, password: hashPassword })
        await FileServise.createDir(new File({user: user.id, name: ''}))
        await user.save()
    }

    async get(email, password) {
        const user = await User.findOne({ email })
        if (!user) {
            throw new CustomError('Пользователь не найден!', 404)
        }

        const isValidPassword = bcrypt.compareSync(password, user.password)
        if (!isValidPassword) {
            throw new CustomError('Неверный пароль!', 400)
        }

        const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' })
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
                date: user.date
            }
        }
    }

    async getById(id) {
        const user = await User.findOne({ _id: id })
        if (!user) {
            throw new CustomError('Пользователь не найден!', 404)
        }

        const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' })
   
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
                date: user.date
            }
        }
    }
}

export default new UserServer()