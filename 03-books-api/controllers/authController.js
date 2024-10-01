import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'

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
const login = async (req, res) => {
  // Validar que el email y el password vengan en el body
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and Password are required' })
  }

  try {
    // Buscar al usuario en la base de datos con el correo proporcionado.
    const userEmail = await User.findOne({ email: req.body.email })

    if (!userEmail) {
      return res.status(400).json({ message: 'Email or Password Error' })
    }

    // Si el correo si existe, entonces comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos.
    const isPasswordValid = await bcrypt.compare(
      req.body.password, // Contraseña proporcionada
      userEmail.password // Contraseña almacenada
    ) // devuelve un booleano (true o false)

    // Si la contraseña es incorrecta: Error 401 (Unauthorized)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email or Password Error' })
    }

    // Si el correo existe, y la contraseña es correcta, entonces generamos un token de autenticación (JWT)

    // Construimos el objeto del Payload
    const payload = {
      id: userEmail._id,
      email: userEmail.email,
      role: userEmail.role,
      iat: Math.floor(Date.now() / 1000), // fecha de creación del token en segundos
      exp: Math.floor(Date.now() / 1000 + (7 * 24 * 60 * 60)) // fecha y hora de expiración del token en 7 días
    }

    // Construyo el token con el método encode de JWT
    const token = jwt.encode(payload, process.env.SECRET)

    // Devolvemos el token en la respuesta
    return res.status(200).json({ message: 'User Logged In', token })
  } catch (error) {
    res.status(500).json({ message: 'Error Logging In', error: error.message })
  }
}

export { register, login }
