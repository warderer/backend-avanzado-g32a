// Un Middleware es una función que se ejecuta antes de que se ejecute el controlador de una ruta. En este caso, el Middleware isAuth se encargará de verificar si el token proporcionado en la cabecera de la petición es válido y si el usuario esta autenticado para poder acceder a la ruta.

import jwt from 'jwt-simple'

const isAuth = (req, res, next) => {
  // Obtener el encabezado de autorización: Bearar token
  const authHeader = req.headers.authorization

  // Verificar si el encabezado de autorización existe
  if (!authHeader) {
    return res.status(400).json({ message: 'Authorization Header is required' })
  }

  // Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY2ZmI1Mzk1NDIwZDRlM2M1ZmNiZmQ3NSIsImVtYWlsIjoiZ2FsaWxlYUBsb3JldHRvLmNvbSIsInJvbGUiOiJDVVNUT01FUiIsImlhdCI6MTcyNzc1MTUxOSwiZXhwIjoxNzI4MzU2MzE5fQ.JIl6B9gXYIVgUpKaaFCL1UArOO2CnQSvRWOtGWYsjLU

  // Separar el encabezado de autorización en un arreglo
  const [bearer, token] = authHeader.split(' ')

  // Verificar que el encabezado de autorización comience con Bearer
  if (bearer !== 'Bearer') {
    return res.status(400).json({ message: 'Invalid Authorization Header' })
  }

  // Verificar que el token no esté vacío
  if (!token) {
    return res.status(400).json({ message: 'Token is required' })
  }

  try {
    // Validar que el token sea válido y no este manipulado
    const payload = jwt.decode(token, process.env.SECRET)

    // Verificar si el token ha expirado
    const now = Date.now() / 1000 // fecha actual en segundos
    if (payload.exp <= now) {
      return res.status(403).json({ message: 'Token Expired' })
    }

    // Valido el rol del usuario
    req.role = payload.role

    // Si el token es válido, entonces ejecuto el siguiente Middleware o el controlador de la ruta
    next()
  } catch (error) { // error 403 (Forbidden)
    return res.status(403).json({ message: 'Token Error', error: error.message })
  }
}

export { isAuth }
