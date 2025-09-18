import Course from '../models/Course.js'

export const CreateCourse = async (req, res) => {
	try {
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
		} = req.body

		if (
			!course_code ||
			typeof course_code !== 'string' ||
			course_code.trim().length === 0
		) {
			return res.status(400).json({ message: 'Course code is required.' })
		}
		if (
			!course_title ||
			typeof course_title !== 'string' ||
			course_title.trim().length === 0
		) {
			return res.status(400).json({ message: 'Course title is required.' })
		}
		if (
			!course_description ||
			typeof course_description !== 'string' ||
			course_description.trim().length === 0
		) {
			return res
				.status(400)
				.json({ message: 'Course description is required.' })
		}
		if (
			!course_mode ||
			typeof course_mode !== 'string' ||
			course_mode.trim().length === 0
		) {
			return res.status(400).json({ message: 'Course mode is required.' })
		}
		if (
			!course_difficulty_level ||
			typeof course_difficulty_level !== 'string' ||
			course_difficulty_level.trim().length === 0
		) {
			return res
				.status(400)
				.json({ message: 'Course difficulty level is required.' })
		}
		if (
			!course_duration ||
			typeof course_duration !== 'string' ||
			course_duration.trim().length === 0
		) {
			return res.status(400).json({ message: 'Course duration is required.' })
		}
		if (
			!course_starting_date ||
			typeof course_starting_date !== 'string' ||
			course_starting_date.trim().length === 0
		) {
			return res
				.status(400)
				.json({ message: 'Course starting date is required.' })
		}
		if (
			!course_total_live_class ||
			typeof course_total_live_class !== 'number' ||
			course_total_live_class === 'undefined'
		) {
			return res
				.status(400)
				.json({ message: 'Course total live class is required.' })
		}
		if (
			!course_total_joined ||
			typeof course_total_joined !== 'number' ||
			course_total_joined === 'undefined'
		) {
			return res
				.status(400)
				.json({ message: 'Course total joined is required.' })
		}
		if (
			!course_price ||
			typeof course_price !== 'number' ||
			course_price === 'undefined'
		) {
			return res.status(400).json({ message: 'Course price is required.' })
		}

		const existingCourse = await Course.findOne({ course_code })

		if (existingCourse) {
			return res
				.status(400)
				.json({ message: 'Course existed with this course code.' })
		}

		const newCourse = new Course({
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
		})

		await newCourse.save()
		res.status(201).json(newCourse)
	} catch (error) {
		return res.status(500).json({ message: error.message })
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

		const courseDetails = await Course.findOne({ course_title })

		if (!courseDetails) {
			return res.status(404).json({ message: 'Course not found' })
		}

		res.status(200).json(courseDetails)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
