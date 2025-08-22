import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+\@.+\..+/, 'Please enter a valid email address'],
	},
	contact: {
		type: Number,
		required: false,
		unique: true,
	},
	password: {
		type: String,
	},
})

const User = mongoose.model('User', userSchema)

export default User
