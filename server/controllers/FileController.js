import FileServise from "../Servises/FileServise.js";
import File from "../models/File.js";
import User from "../models/User.js";
import config from "config"
import fs from 'fs'
import { v4 } from 'uuid'

class FileController {
    async createDir(req, res) {
        try {
            const { name, type, parent, extension } = req.body
            const file = new File({ name, type, parent, extension, user: req.user.id })
            const parentFile = await File.findOne({ _id: parent })
            if (parentFile) {
                file.path = `${parentFile.path}\\${file.name}`
                await FileServise.createDir(file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            } else {
                file.path = name
                await FileServise.createDir(file)
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e.message })
        }
    }

    async getFiles(req, res) {
        try {
            const { sort, search } = req.query
            let files

            if (search) {
                files = await File.find({ user: req.user.id })
                return res.json(files.filter(file => file.name.toLowerCase().includes(search.toLowerCase())))
            }

            switch (sort) {
                case 'name':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 })
                    break
                case 'type':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 })
                    break
                case 'date':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: 1 })
                    break
                default:
                    files = await File.find({ user: req.user.id, parent: req.query.parent })
                    break
            }

            files.map(async (file) => {
                const regexp = FileServise.getAllChilds(file)
                await file.sizeDir(file, req.user.id, regexp)
            })

            return res.json(files)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Can not get files!' })
        }
    }

    async uploadFiles(req, res) {
        try {
            const file = req.files?.file
            if (!file) {
                return res.status(400).json({ message: 'Загрузка файла была прервана' })
            }
            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })
            const user = await User.findOne({ _id: req.user.id })

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message: 'Недостаточно места на диске' })
            }

            const path = `${config.get('filesPath')}\\${user._id}\\${parent?.path || ''}\\${file.name}`
            if (fs.existsSync(path)) {
                return res.status(400).json({ message: 'Файл с таким названием уже существует' })
            }
            file.mv(path)
            const type = file.name.split('.').pop()

            let filePath = file.name
            if (parent) {
                filePath = parent.path + '\\' + file.name
            }

            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent?._id,
                user: user._id
            })

            if (parent) {
                parent.childs.push(dbFile._id)
                await parent.save()
            }

            user.usedSpace += dbFile.size
            await user.save()
            await dbFile.save()
            return res.status(200).json(dbFile)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Upload file error!' })
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ user: req.user.id, _id: req.query.id })
            const path = FileServise.getPath(file)

            if (!fs.existsSync(path)) {
                return res.status(400).json({ message: 'Файл не найден!' })
            }
            return res.download(path, file.name)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Download file error!' })
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ user: req.user.id, _id: req.query.id })
            const user = await User.findOne({ _id: req.user.id })
            if (!file) {
                return res.status(400).json({ message: 'Файл не найден!' })
            }

            const parent = await File.findOne({ user: req.user.id, _id: req.query.parent })
            if (parent) {
                parent.childs = parent.childs.filter(child => child.toString() !== file._id.toString())
                await parent.save()
            }
            let countFiles
            if (file.childs.length === 0) {
                user.usedSpace -= file.size
                FileServise.deleteOneFile(file)
            } else {
                const regexp = FileServise.getAllChilds(file)
                const filesToDelete = await File.find({ user: req.user.id, path: regexp })
                filesToDelete.push(file)

                user.usedSpace -= file.size

                countFiles = filesToDelete.length

                filesToDelete
                    .sort((a, b) => b.path.split('\\').length - a.path.split('\\').length)
                    .map(file =>
                        FileServise.deleteOneFile(file)
                    )
                await File.deleteMany({ user: req.user.id, path: regexp })
            }
            await user.save()
            await File.deleteOne({ user: req.user.id, _id: req.query.id })
            return res.status(200).json({ message: countFiles ? `Удаленных файлов: ${countFiles} ` : 'Файл/папка удален(а)' })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Delete file error!' })
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            const user = await User.findOne({ _id: req.user.id })
            const avatarName = v4() + '.' + file.name.split('.').at(-1)
            if (user.avatar) {
                fs.unlinkSync(`${config.get('staticPath')}\\${user.avatar}`)
            }
            file.mv(`${config.get('staticPath')}\\${avatarName}`)
            user.avatar = avatarName
            await user.save()
            return res.status(200).json(user)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Upload avatar error!' })
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id })
            fs.unlinkSync(`${config.get('staticPath')}\\${user.avatar}`)
            user.avatar = ''
            await user.save()
            return res.status(200).json(user)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Delete avatar error!' })
        }
    }

    async pasteFile(req, res) {
        try {
            const file = await File.findById(req.query.file)
            const parent = await File.findOne({ _id: req.query.parent })
            const user = await User.findById(req.user.id)

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message: 'Недостаточно места на диске' })
            }

            const oldPath = `${config.get('filesPath')}\\${user._id}\\${file.path}`
            const newPath = `${config.get('filesPath')}\\${user._id}\\${parent?.path || ''}\\${file.name}`

            if (fs.existsSync(newPath)) {
                return res.status(400).json({ message: 'Файл с таким названием уже существует' })
            }
            fs.cpSync(oldPath, newPath)

            let filePath = file.name
            if (parent) {
                filePath = parent.path + '\\' + file.name
            }

            const newFile = new File({
                name: file.name,
                type: file.type,
                size: file.size,
                path: filePath,
                parent: parent?._id,
                user: user._id
            })

            user.usedSpace += newFile.size

            if (parent) {
                parent.childs.push(newFile._id)
                await parent.save()
            }

            await user.save()
            await newFile.save()

            return res.status(200).json(newFile)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Paste file error!' })
        }
    }

    async cutAndPasteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.body.id })
            const oldParent = await File.findOne({ _id: req.body.oldParent })
            const newParent = await File.findOne({ _id: req.body.newParent })
            const oldPath = `${config.get('filesPath')}\\${req.user.id}\\${file.path}`
            const newPath = `${config.get('filesPath')}\\${req.user.id}\\${newParent?.path || ''}\\${file.name}`

            if (fs.existsSync(newPath)) {
                return res.status(400).json({ message: 'Файл с таким названием уже существует' })
            }
            fs.rename(oldPath, newPath, (err) => {
                if (err) throw err
            })

            const oldFilePath = file.path.split('\\').slice(0, -1).join('\\')
            let filePath = oldFilePath + '\\' + file.name

            if (newParent) {
                filePath = newParent.path + '\\' + file.name
            }

            if (req.body.newParent === null) {
                filePath = file.name
                file.parent = null
            }

            if (oldParent) {
                oldParent.childs = oldParent.childs.filter(child => child.toString() !== file._id.toString())
                await oldParent.save()
            }

            if (newParent) {
                newParent.childs.push(file._id)
                file.parent = newParent._id
                await newParent.save()
            }

            file.path = filePath
            await file.save()

            return res.status(200).json(file)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Rename file error!' })
        }
    }

    async renameFile(req, res) {
        try {
            const newName = req.body.name
            const file = await File.findOne({ _id: req.body.id })

            let newFilePath
            const oldFilePath = file.path.split('\\')
            if (oldFilePath.length >= 2) {
                newFilePath = oldFilePath.slice(0, -1).join('\\') + '\\' + newName
            } else {
                newFilePath =  newName
            }
            
            const oldPath = `${config.get('filesPath')}\\${req.user.id}\\${file.path}`
            const newPath = `${config.get('filesPath')}\\${req.user.id}\\${newFilePath}`

            if (fs.existsSync(newPath)) {
                return res.status(400).json({ message: 'Файл с таким названием уже существует' })
            }
            fs.rename(oldPath, newPath, (err) => {
                if (err) throw err
            })

            const nameAndType = newName.split('.')
            if (nameAndType.length === 2) {
                const type = nameAndType.at(-1)
                file.type = type
            }
            file.path = newFilePath
            file.name = newName
            await file.save()

            return res.status(200).json(file)
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Rename file error!' })
        }
    }
}

export default new FileController()