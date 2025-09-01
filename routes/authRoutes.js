import express from 'express'
import {
	ForgotPassword,
	Login,
	SignUp,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/forgot-password/email', ForgotPassword)
export default router
