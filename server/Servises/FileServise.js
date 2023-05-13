import fs from 'fs'
import config from 'config'
import File from '../models/File.js'

class FileServise {
    createDir(file) {
        const filePath = `${config.get('filesPath')}\\${file.user}\\${file.path || ''}`
        return new Promise((resolse, reject) => {
            try {
                if (fs.existsSync(filePath)) {
                    return reject({ message: 'Папка с таким названием уже существует' })
                }
                fs.mkdirSync(filePath)
                return resolse({ message: 'Папка успешно создана' })
            } catch (e) {
                return reject({ message: 'Произошла непредвиденная ошибка при создании папки' })
            }
        })
    }

    deleteOneFile(file) {
        const path = this.getPath(file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getAllChilds(file) {
        const path = file.path.split('\\').join('\\\\')
        return new RegExp("^" + path + '\\\\')
    }

    getPath(file) {
        return `${config.get('filesPath')}\\${file.user}\\${file.path}`
    }
}


export default new FileServise()
