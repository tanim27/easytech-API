import mongoose from 'mongoose'

const { Schema } = mongoose

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const contactRegex = /^01[3-9]\d{8}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			minlength: [3, 'Name must be at least 3 characters'],
			maxlength: [50, 'Name cannot exceed 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			match: [emailRegex, 'Please enter a valid email address'],
			index: true,
		},
		contact: {
			type: String,
			required: [true, 'Contact number is required'],
			unique: true,
			match: [contactRegex, 'Please enter a valid Bangladeshi contact number'],
			index: true,
		},
		password: {
			type: String,
			required: true,
			minlength: [6, 'Password must be at least 6 characters'],
			maxlength: [64, 'Password cannot exceed 64 characters'],
			match: [
				passwordRegex,
				'Password must contain at least one uppercase, one lowercase, and one special character',
			],
		},
	},
	{ timestamps: true },
)

// Pre-save hook for normalization and extra password check
userSchema.pre('save', function (next) {
	if (this.email) this.email = this.email.toLowerCase()
	if (this.name) this.name = this.name.trim()

	if (!passwordRegex.test(this.password)) {
		return next(
			new Error(
				'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
			),
		)
	}

	next()
})

const User = mongoose.model('User', userSchema)

export default User
