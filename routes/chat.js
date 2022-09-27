import express from 'express'
import fetchuser from '../middleware/fetchuser.js'
import { createchat , fetchchat , groupchat , renamegroup , removegroup , addgroup } from '../controller/chatController.js'

const router = express.Router()


router.post('/createchat' , fetchuser , createchat)
router.get('/fetchchat' , fetchuser , fetchchat)
router.post('/groupchat' , fetchuser , groupchat)
router.post('/renamegroup' , fetchuser , renamegroup)
router.put('/removegroup' , fetchuser , removegroup)
router.post('/addgroup' , fetchuser , addgroup)


export default router