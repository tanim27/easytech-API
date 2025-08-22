import bcrypt from 'bcrypt'
import User from '../models/User.js'

export const SignUp = async (req, res) => {
	try {
		const { name, email, contact, password } = req.body

		const existedUser = await User.findOne({ email })

		if (existedUser) {
			return res.status(400).json({ message: 'User already exists!' })
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: 'Password must be atleast 6 characters long.' })
		}

		const saltLevel = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, saltLevel)

		const newUser = new User({
			name,
			email,
			contact,
			password: hashedPassword,
		})

		await newUser.save()

		return res.status(201).json({ newUser, message: 'Registered successfully' })
	} catch (err) {
		console.log(err.message)
		return res
			.status(500)
			.json({ message: 'Server error', details: err.message })
	}
}

export const Login = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })

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
