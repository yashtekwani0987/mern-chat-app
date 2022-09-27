import express from 'express'
import {createuser , loginuser , searchuser} from '../controller/userController.js'
import fetchuser from '../middleware/fetchuser.js'

const router = express.Router()

router.post('/createuser',createuser)
router.post('/loginuser', loginuser)
router.get('/searchuser',fetchuser,searchuser)

export default router