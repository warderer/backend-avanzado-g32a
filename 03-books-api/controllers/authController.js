import User from '../models/User.js'
import bcrypt from 'bcrypt'

// Register a new user
const register = async (req, res) => {
  try {
    // Validar que el email y el password vengan en el body
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Email and Password are required' })
    }

    // Encriptar la contraseña co ayuda de Bcrypt
    const saltRounds = 10 // El número de veces que se aplicará el algoritmo de encriptación
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

    // Reemplazar la contraseña de texto plano del body por la encriptada
    req.body.password = hashedPassword

    // Crear al usuario en la base de datos
    const newUser = await User.create(req.body)

    // PEROOOO.... debemos eliminar la contraseña del objeto de respuesta por seguridad. Mongo ignora las propiedades que tienen el valor de undefined, por lo que podemos hacer lo siguiente:
    newUser.password = undefined

    return res.status(201).json({ message: 'User Created', newUser })
  } catch (error) {
    res.status(500).json({ message: 'Error Creating User', error: error.message })
  }
}

// Login

export { register }
