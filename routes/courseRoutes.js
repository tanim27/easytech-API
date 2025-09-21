import express from 'express'
import {
	CreateCourse,
	DeleteCourseDetails,
	GetAllCourses,
	GetCourseDetails,
	UpdateCourseDetails,
} from '../controllers/courseController.js'
import { isAdmin } from '../middlewares/IsAdmin.js'
import { ProtectRoute } from './../middlewares/ProtectRoute.js'

const router = express.Router()

router.post('/create-course', ProtectRoute, isAdmin, CreateCourse)
router.get('/', GetAllCourses)
router.get('/:course_title', GetCourseDetails)
router.put('/:id', ProtectRoute, isAdmin, UpdateCourseDetails)
router.delete('/:id', ProtectRoute, isAdmin, DeleteCourseDetails)

export default router
