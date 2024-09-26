import express from 'express'
import { createBook, getAllBooks, getBookById, updateBookById, deleteBookById } from '../controllers/bookController.js'

const bookRoutes = express.Router()

// Rutas de libros
bookRoutes.post('/', createBook)
bookRoutes.get('/', getAllBooks)
bookRoutes.get('/:bookId', getBookById)
bookRoutes.patch('/:bookId', updateBookById)
bookRoutes.delete('/:bookId', deleteBookById)

export default bookRoutes
