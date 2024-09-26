import Author from '../models/Author.js'
import Book from '../models/Book.js'

// CREATE
const createBook = async (req, res) => {
  const bookData = req.body

  // Validaciones
  if (Object.keys(bookData).length === 0) {
    return res.status(400).json({ message: 'Book data is required' })
  }

  if (!Array.isArray(bookData.authors)) {
    return res.status(400).json({ message: 'Authors must be an array' })
  }

  if (!bookData.authors || bookData.authors.length === 0) {
    return res.status(400).json({ message: 'Book must have at least one author' })
  }

  // Crear autores, uno por uno y esperar a que todos se guarden en la colección
  try {
    const authorModels = await Promise.all(bookData.authors.map(async author => {
      // Si el autor ya existe, devolverlo; sino crearlo.
      const existingAuthor = await Author.findOne({ firstName: author.firstName, lastName: author.lastName, birthDate: author.birthDate }) // Si findOne no encuentra nada, devuelve null.

      if (existingAuthor) {
        return existingAuthor
      }

      // Si el autor no existe, se crea uno nuevo
      const newAuthor = new Author(author)
      return await Author.create(newAuthor)
    }))

    // Como ya se guardaron los autores, se pueden asignar al libro. Necesitamos los _id de los autores.
    bookData.authors = authorModels.map(author => author._id)

    // Crear el libro
    const newBook = await Book.create(bookData)
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// READ
const getAllBooks = async (req, res) => {
  try {
    const books = await Book
      .find({ isActive: true })
      .populate('authors', 'firstName lastName bio birthDate -_id') // populate('authors') reemplaza los ObjectID de authors por los documentos de la colección Author. 'firstName lastName birthDate -_id' indica que solo se deben mostrar esos campos y no el _id.
    if (!books) {
      return res.status(404).json({ message: 'No books found' })
    }
    res.status(200).json(books)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getBookById = async (req, res) => {
  // Valido que el ID sea un ObjectID de MongoDB (24 caracteres alfanuméricos en hexadecimal)
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  try {
    const book = await Book
      .findById({ _id: req.params.bookId, isActive: true })
      .populate('authors', 'firstName lastName bio birthDate -_id')
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
    res.status(200).json(book)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// UPDATE

const updateBookById = async (req, res) => {
  // Valido que el ID sea un ObjectID de MongoDB (24 caracteres alfanuméricos en hexadecimal)
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  try {
    const book = await Book
      .findByIdAndUpdate(req.params.bookId, req.body, { new: true })
      .populate('authors', 'firstName lastName bio birthDate -_id')

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
    res.status(200).json(book)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// DELETE
const deleteBookById = async (req, res) => {
  // Valido que el ID sea un ObjectID de MongoDB (24 caracteres alfanuméricos en hexadecimal)
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  // HARD DELETE: Borrado físico de la base de datos.
  // Si recibo el query ?destroy=true, borro el libro de la base de datos.
  if (req.query.destroy === 'true') {
    try {
      const book = await Book.findByIdAndDelete(req.params.bookId)
      if (!book) {
        return res.status(404).json({ message: 'Book not found' })
      }
      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  }

  // SOFT DELETE: Cambio el estado (isActive) del libro a inactivo (false).
  try {
    const book = await Book.findByIdAndUpdate(req.params.bookId, { isActive: false }, { new: false })

    if (!book || book.isActive === false) {
      return res.status(404).json({ message: 'Book not found' })
    }
    res.status(204).end()
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById
}
