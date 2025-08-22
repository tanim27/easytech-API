import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
const port = process.env.NEXT_PUBLIC_API_BASE_URL

dotenv.config()
connectDB()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)

app.listen(port, (req, res) => {
	console.log(`Server running at port ${port}`)
})
