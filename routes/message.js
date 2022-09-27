import express from 'express'
import { allMessages, sendMessage } from '../controller/messageController.js'
import fetchuser from '../middleware/fetchuser.js'


const router = express.Router()


router.post('/',fetchuser,sendMessage)
router.get('/:chatId',fetchuser,allMessages)


export default router