import express from 'express'
import {
	CreateCourse,
	DeleteCourseDetails,
	GetAllCourses,
	GetCourseDetails,
	UpdateCourseDetails,
} from '../controllers/courseController.js'

const router = express.Router()

router.post('/create-course', CreateCourse)
router.get('/', GetAllCourses)
router.get('/:course_title', GetCourseDetails)
router.put('/:id', UpdateCourseDetails)
router.delete('/:id', DeleteCourseDetails)

export default router
