import bcrypt from 'bcrypt'
import User from '../models/User.js'

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const contactRegex = /^01[3-9]\d{8}$/
const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/

export const SignUp = async (req, res) => {
	try {
		const { name, email, contact, password } = req.body

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
		})

		await newUser.save()

		const userResponse = { ...newUser._doc }
		delete userResponse.password

		return res
			.status(201)
			.json({ message: 'Registered successfully', user: userResponse })
	} catch (err) {
		if (err.name === 'ValidationError') {
			const messages = Object.values(err.errors).map((e) => e.message)
			return res.status(400).json({ message: messages.join(', ') })
		}
		console.error(err)
		return res
			.status(500)
			.json({ message: 'Server error', details: err.message })
	}
}

export const Login = async (req, res) => {
	const { identifier, password } = req.body

	try {
		const user = await User.findOne({
			$or: [{ email: identifier }, { contact: identifier }],
		})

		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) {
			return res.status(400).json({ message: 'password is incorrect' })
		}

		return res.status(200).json({ user, message: 'Logged in successfully' })
	} catch (err) {
		console.log(err.message)
		return res
			.status(500)
			.json({ message: 'Server error', details: err.message })
	}
}
