import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
	contact: { type: String, required: true, unique: true },
	otp: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 180 },
})

const OTP = mongoose.model('OTP', otpSchema)

export default OTP
