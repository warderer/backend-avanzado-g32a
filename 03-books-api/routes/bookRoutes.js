import express from 'express'
import { createBook, getAllBooks, getBook, updateBookById, deleteBookById } from '../controllers/bookController.js'
import { isAuth } from '../middlewares/isAuth.js'
import { isAdmin } from '../middlewares/isAdmin.js'

const bookRoutes = express.Router()

// Rutas de libros
bookRoutes.post('/', isAuth, isAdmin, createBook)
bookRoutes.get('/', getAllBooks)
bookRoutes.get('/:bookId', getBook)
bookRoutes.patch('/:bookId', isAuth, isAdmin, updateBookById)
bookRoutes.delete('/:bookId', isAuth, isAdmin, deleteBookById)

export default bookRoutes
