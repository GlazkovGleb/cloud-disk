import { Router } from "express";
import { check } from "express-validator";
import authMiddleware from '../middleware/auth.middleware.js'
import FileController from "../controllers/FileController.js";

const router = new Router()

router.post('',
    authMiddleware,
    FileController.createDir)

router.get('',
    authMiddleware,
    FileController.getFiles)

router.post('/upload',
    authMiddleware,
    FileController.uploadFiles)

router.get('/download',
    authMiddleware,
    FileController.downloadFile)

router.delete('/',
    authMiddleware,
    FileController.deleteFile)

router.post('/avatar',
    authMiddleware,
    FileController.uploadAvatar)

router.delete('/avatar',
    authMiddleware,
    FileController.deleteAvatar)

router.get('/paste',
    authMiddleware,
    FileController.pasteFile)

router.post('/cut_and_paste',
    authMiddleware,
    FileController.cutAndPasteFile)

router.post('/rename',
    authMiddleware,
    FileController.renameFile)
    
export default router