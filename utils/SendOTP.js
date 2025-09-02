import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_NUMBER

const client = twilio(accountSid, authToken)

const SendOTP = async (contact, otp) => {
	try {
		const message = await client.messages.create({
			body: `Your OTP is ${otp}`,
			from: twilioPhone,
			to: contact,
		})
		console.log('OTP sent:', message.sid)
		return true
	} catch (err) {
		console.error('Error sending OTP SMS:', err.message)
		throw new Error('Failed to send OTP.')
	}
}

export default SendOTP
