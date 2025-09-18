import express from 'express'
import {
	Login,
	PasswordResetWithEmail,
	SignUp,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/password-reset-request/email', PasswordResetWithEmail)
// router.post('/password-reset-request/otp', PasswordResetWithOTP)

export default router
