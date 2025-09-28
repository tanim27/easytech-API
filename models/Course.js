import mongoose from 'mongoose'

const { Schema } = mongoose

const courseOverviewSchema = new Schema({
	course_code: { type: String, required: true },
	course_title: { type: String, required: true },
	course_description: { type: String, required: true },
	course_mode: { type: String, required: true },
	course_difficulty_level: { type: String, required: true },
	course_duration: { type: String, required: true },
	course_starting_date: { type: Date, required: true },
	course_total_live_class: { type: Number, required: true },
	course_total_joined: { type: Number, required: true },
	course_price: { type: Number, required: true },
})

const courseOutputSchema = new Schema({
	course_output_image: { type: String, required: true },
	course_output_title: { type: String, required: true },
	course_output_description: { type: String, required: true },
})

const courseContentSchema = new Schema({
	course_module: { type: String, required: true },
	course_topic: [{ type: String, required: true }],
})

const courseInstructorSchema = new Schema({
	course_instructor_image: { type: String, required: true },
	course_instructor_name: { type: String, required: true },
	course_instructor_description: { type: String, required: true },
	course_instructor_designation: { type: String, required: true },
})

const courseSchema = new Schema(
	{
		course_overview: courseOverviewSchema,
		course_output: [courseOutputSchema],
		course_content: [courseContentSchema],
		course_instructor: [courseInstructorSchema],
	},
	{ timestamps: true },
)

const Course = mongoose.model('Course', courseSchema)

export default Course
