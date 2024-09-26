import express from 'express'
import { createBook, getAllBooks, getBook, updateBookById, deleteBookById } from '../controllers/bookController.js'

const bookRoutes = express.Router()

// Rutas de libros
bookRoutes.post('/', createBook)
bookRoutes.get('/', getAllBooks)
bookRoutes.get('/:bookId', getBook)
bookRoutes.patch('/:bookId', updateBookById)
bookRoutes.delete('/:bookId', deleteBookById)

export default bookRoutes
