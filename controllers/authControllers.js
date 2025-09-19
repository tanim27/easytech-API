import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import User from '../models/User.js'

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const contactRegex = /^01[3-9]\d{8}$/
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/

export const SignUp = async (req, res) => {
	try {
		const { name, email, contact, password, confirmPassword, role } = req.body

		if (!name || !name.trim())
			return res.status(400).json({ message: 'Name is required.' })
		if (name.length < 3 || name.length > 50) {
			return res
				.status(400)
				.json({ message: 'Name must be between in 3 and 50 characters.' })
		}

		if (!email || !emailRegex.test(email))
			return res
				.status(400)
				.json({ message: 'Please enter a valid email address.' })

		if (!contact || !contactRegex.test(contact))
			return res
				.status(400)
				.json({ message: 'Please enter a valid Bangladeshi contact number.' })

		if (!password || password.length < 6 || password.length > 64) {
			return res
				.status(400)
				.json({ message: 'Password must be between 6 and 64 characters.' })
		}
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, and one special character.',
			})
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: 'Passwords do not match.' })
		}

		const existingUser = await User.findOne({ $or: [{ email }, { contact }] })
		if (existingUser) {
			if (existingUser.email === email) {
				return res
					.status(400)
					.json({ message: 'User with this email already exists!' })
			}
			if (existingUser.contact === contact) {
				return res
					.status(400)
					.json({ message: 'This contact number has been used previously.' })
			}
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			name: name.trim(),
			email: email.toLowerCase(),
			contact,
			password: hashedPassword,
			role,
		})

		await newUser.save()

		const token = jwt.sign(
			{
				id: newUser._id,
				email: newUser.email,
				role: newUser.role,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: '1h' },
		)
		const userResponse = { ...newUser._doc }
		delete userResponse.password

		return res
			.status(201)
			.json({ message: 'Registered successfully.', token, user: userResponse })
	} catch (err) {
		if (err.name === 'ValidationError') {
			const messages = Object.values(err.errors).map((e) => e.message)
			return res.status(400).json({ message: messages.join(', ') })
		}
		console.error(err)
		return res
			.status(500)
			.json({ message: 'Internal server error.', details: err.message })
	}
}

export const Login = async (req, res) => {
	const { identifier, password } = req.body

	try {
		const user = await User.findOne({
			$or: [{ email: identifier }, { contact: identifier }],
		})

		if (!user) {
			return res.status(400).json({ message: 'User not found.' })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Password is incorrect.' })
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET_KEY,
			{
				expiresIn: '1h',
			},
		)

		const { password: pwd, ...userData } = user._doc

		return res.status(200).json({
			message: 'Logged in successfully.',
			token,
			user: userData,
		})
	} catch (err) {
		console.error(err.message)
		return res
			.status(500)
			.json({ message: 'Internal server error.', details: err.message })
	}
}

export const PasswordResetWithEmail = async (req, res) => {
	try {
		const { email } = req.body

		if (!email) {
			return res.status(400).send({ message: 'Please provide a valid email.' })
		}

		const user = await User.findOne({ email })

		if (!user) {
			return res
				.status(400)
				.send({ message: 'User not found. Please register first.' })
		}

		const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
			expiresIn: '1h',
		})

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			secure: true,
			auth: {
				user: process.env.MY_GMAIL,
				pass: process.env.MY_PASSWORD,
			},
		})

		const resetURL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password/${token}`

		const receiver = {
			from: process.env.MY_GMAIL,
			to: email,
			subject: 'Password Reset Request.',
			text: `Click on this link to generate your new password: ${resetURL}`,
		}

		await transporter.sendMail(receiver)

		return res.status(200).send({
			message: 'Password reset link send successfully on your email account.',
		})
	} catch (error) {
		console.error(error)
		return res
			.status(500)
			.send({ message: 'Internal server error.', details: err.message })
	}
}

// export const PasswordResetWithOTP = async (req, res) => {
// 	try {
// 		const { contact } = req.body

// 		const user = await User.findOne({ contact })
// 		if (!user) {
// 			return res.status(404).json({ message: 'User not found.' })
// 		}

// 		const otp = Math.floor(100000 + Math.random() * 900000)
// 		await OTP.findOneAndUpdate(
// 			{ contact },
// 			{ otp, createdAt: new Date() },
// 			{ upsert: true, new: true },
// 		)

// 		await SendOTP(contact, otp)

// 		return res.json({ message: 'OTP sent successfully.' })
// 	} catch (err) {
// 		console.error(err)
// 		res
// 			.status(500)
// 			.json({ message: 'Internal server error.', details: err.message })
// 	}
// }

// export const verifyOtp = async (req, res) => {
// 	try {
// 		const { contact, otp } = req.body

// 		const otpEntry = await OTP.findOne({ contact })
// 		if (!otpEntry || otpEntry.otp !== otp) {
// 			return res.status(400).json({ message: 'Invalid OTP.' })
// 		}

// 		const expiry = new Date(otpEntry.createdAt)
// 		expiry.setMinutes(expiry.getMinutes() + 3)
// 		if (new Date() > expiry) {
// 			return res.status(400).json({ message: 'OTP expired.' })
// 		}

// 		const resetToken = jwt.sign({ contact }, process.env.JWT_SECRET_KEY, {
// 			expiresIn: '3m',
// 		})

// 		await OTP.deleteOne({ contact })

// 		return res.json({
// 			message: 'OTP verified',
// 			resetUrl: `/reset-password/${resetToken}`,
// 			resetToken,
// 		})
// 	} catch (err) {
// 		console.error(err)
// 		res
// 			.status(500)
// 			.json({ message: 'Internal server error.', details: err.message })
// 	}
// }
