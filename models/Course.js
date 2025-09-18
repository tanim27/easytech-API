import mongoose from 'mongoose'

const { Schema } = mongoose

const courseSchema = Schema({
	course_code: {
		type: String,
		required: [true, 'Course id is required'],
	},
	course_title: {
		type: String,
		required: [true, 'Course title is required'],
	},
	course_description: {
		type: String,
		required: [true, 'Course description is required'],
	},
	course_mode: {
		type: String,
		required: [true, 'Course mode is required'],
	},
	course_difficulty_level: {
		type: String,
		required: [true, 'Course difficulty level is required'],
	},
	course_duration: {
		type: String,
		required: [true, 'Course duration is required'],
	},
	course_starting_date: {
		type: String,
		required: [true, 'Course starting is required'],
	},
	course_total_live_class: {
		type: Number,
		required: [true, 'Course total live class is required'],
	},
	course_total_joined: {
		type: Number,
		required: [true, 'Course total joined is required'],
	},
	course_price: {
		type: Number,
		required: [true, 'Course price is required'],
	},
})

const Course = mongoose.model('Course', courseSchema)

export default Course
