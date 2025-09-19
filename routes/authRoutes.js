import express from 'express'
import {
	Login,
	PasswordResetWithEmail,
	SignUp,
} from '../controllers/authControllers.js'
import { ProtectRoute } from './../middlewares/ProtectRoute.js'

const router = express.Router()

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/password-reset-request/email', PasswordResetWithEmail)
router.post('/token', ProtectRoute)

// router.post('/password-reset-request/otp', PasswordResetWithOTP)

export default router
