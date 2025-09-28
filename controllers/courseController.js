import Course from '../models/Course.js'

export const CreateCourse = async (req, res) => {
	try {
		const {
			course_overview,
			course_output,
			course_content,
			course_instructor,
		} = req.body

		if (!course_overview || typeof course_overview !== 'object') {
			return res.status(400).json({ message: 'Course overview is required.' })
		}

		const {
			course_code,
			course_title,
			course_description,
			course_mode,
			course_difficulty_level,
			course_duration,
			course_starting_date,
			course_total_live_class,
			course_total_joined,
			course_price,
		} = course_overview

		if (!course_code || course_code.trim() === '') {
			return res.status(400).json({ message: 'Course code is required.' })
		}
		if (!course_title || !course_description) {
			return res
				.status(400)
				.json({ message: 'Course title and description are required.' })
		}
		if (!course_mode || !course_difficulty_level || !course_duration) {
			return res.status(400).json({
				message: 'Course mode, difficulty level, and duration are required.',
			})
		}
		if (!course_starting_date || isNaN(Date.parse(course_starting_date))) {
			return res
				.status(400)
				.json({ message: 'Valid course starting date is required.' })
		}
		if (
			course_total_live_class === undefined ||
			course_total_joined === undefined ||
			course_price === undefined
		) {
			return res.status(400).json({
				message: 'Total live class, total joined, and price are required.',
			})
		}

		const existingCourse = await Course.findOne({
			'course_overview.course_code': course_code,
		})
		if (existingCourse) {
			return res.status(400).json({
				message: 'Course already exists with this course code.',
			})
		}

		if (!Array.isArray(course_output) || course_output.length === 0) {
			return res
				.status(400)
				.json({ message: 'Course output is required and must be an array.' })
		}
		for (let i = 0; i < course_output.length; i++) {
			const output = course_output[i]
			if (
				!output.course_output_image ||
				!output.course_output_title ||
				!output.course_output_description
			) {
				return res.status(400).json({
					message: `All fields are required for course output at index ${i}.`,
				})
			}
		}

		if (!Array.isArray(course_content) || course_content.length === 0) {
			return res
				.status(400)
				.json({ message: 'Course content is required and must be an array.' })
		}
		for (let i = 0; i < course_content.length; i++) {
			const content = course_content[i]
			if (
				!content.course_module ||
				!Array.isArray(content.course_topic) ||
				content.course_topic.length === 0
			) {
				return res.status(400).json({
					message: `Course module and topics are required for course content at index ${i}.`,
				})
			}
		}

		if (!Array.isArray(course_instructor) || course_instructor.length === 0) {
			return res.status(400).json({
				message: 'Course instructor is required and must be an array.',
			})
		}
		for (let i = 0; i < course_instructor.length; i++) {
			const instructor = course_instructor[i]
			if (
				!instructor.course_instructor_image ||
				!instructor.course_instructor_name ||
				!instructor.course_instructor_description ||
				!instructor.course_instructor_designation
			) {
				return res.status(400).json({
					message: `All fields are required for course instructor at index ${i}.`,
				})
			}
		}

		const newCourse = new Course({
			course_overview,
			course_output,
			course_content,
			course_instructor,
		})

		await newCourse.save()
		res.status(201).json(newCourse)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

export const GetAllCourses = async (req, res) => {
	try {
		const courseDetails = await Course.find()
		res.status(200).json(courseDetails)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

export const GetCourseDetails = async (req, res) => {
	try {
		const { course_title } = req.params

		const courseDetails = await Course.findOne({
			'course_overview.course_title': course_title,
		})

		if (!courseDetails) {
			return res.status(404).json({ message: 'Course not found' })
		}

		res.status(200).json(courseDetails)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

export const UpdateCourseDetails = async (req, res) => {
	try {
		const { id } = req.params
		const {
			course_overview,
			course_output,
			course_content,
			course_instructor,
		} = req.body

		if (!course_overview || typeof course_overview !== 'object') {
			return res.status(400).json({ message: 'Course overview is required.' })
		}

		const {
			course_code,
			course_title,
			course_description,
			course_mode,
			course_difficulty_level,
			course_duration,
			course_starting_date,
			course_total_live_class,
			course_total_joined,
			course_price,
		} = course_overview

		if (!course_code || course_code.trim() === '') {
			return res.status(400).json({ message: 'Course code is required.' })
		}
		if (!course_title || !course_description) {
			return res
				.status(400)
				.json({ message: 'Course title and description are required.' })
		}
		if (!course_mode || !course_difficulty_level || !course_duration) {
			return res.status(400).json({
				message: 'Course mode, difficulty level, and duration are required.',
			})
		}
		if (!course_starting_date || isNaN(Date.parse(course_starting_date))) {
			return res
				.status(400)
				.json({ message: 'Valid course starting date is required.' })
		}
		if (
			course_total_live_class === undefined ||
			course_total_joined === undefined ||
			course_price === undefined
		) {
			return res.status(400).json({
				message: 'Total live class, total joined, and price are required.',
			})
		}

		const course = await Course.findById(id)
		if (!course) {
			return res.status(404).json({ message: 'Course not found.' })
		}

		const existingCourse = await Course.findOne({
			'course_overview.course_code': course_code,
			_id: { $ne: id },
		})
		if (existingCourse) {
			return res.status(400).json({
				message: 'Another course already exists with this course code.',
			})
		}

		if (!Array.isArray(course_output) || course_output.length === 0) {
			return res
				.status(400)
				.json({ message: 'Course output is required and must be an array.' })
		}
		for (let i = 0; i < course_output.length; i++) {
			const output = course_output[i]
			if (
				!output.course_output_image ||
				!output.course_output_title ||
				!output.course_output_description
			) {
				return res.status(400).json({
					message: `All fields are required for course output at index ${i}.`,
				})
			}
		}

		if (!Array.isArray(course_content) || course_content.length === 0) {
			return res
				.status(400)
				.json({ message: 'Course content is required and must be an array.' })
		}
		for (let i = 0; i < course_content.length; i++) {
			const content = course_content[i]
			if (
				!content.course_module ||
				!Array.isArray(content.course_topic) ||
				content.course_topic.length === 0
			) {
				return res.status(400).json({
					message: `Course module and topics are required for course content at index ${i}.`,
				})
			}
		}

		if (!Array.isArray(course_instructor) || course_instructor.length === 0) {
			return res.status(400).json({
				message: 'Course instructor is required and must be an array.',
			})
		}
		for (let i = 0; i < course_instructor.length; i++) {
			const instructor = course_instructor[i]
			if (
				!instructor.course_instructor_image ||
				!instructor.course_instructor_name ||
				!instructor.course_instructor_description ||
				!instructor.course_instructor_designation
			) {
				return res.status(400).json({
					message: `All fields are required for course instructor at index ${i}.`,
				})
			}
		}

		course.course_overview = course_overview
		course.course_output = course_output
		course.course_content = course_content
		course.course_instructor = course_instructor

		await course.save()

		res.status(200).json(course)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error', error: error.message })
	}
}

export const DeleteCourseDetails = async (req, res) => {
	try {
		const course = await Course.findByIdAndDelete(req.params.id)

		if (!course) {
			res.status(400).json({ message: 'Course not found!' })
		}

		res.status(200).json({ message: 'Course Deleted Successfully' })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}
