import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config() // Leer las variables de entorno

const connect = async () => {
  mongoose.connect(process.env.DB_CONNECT_URI) // Nos conectamos a la DB.
  const { connection } = await mongoose // Traemos la conexión, para ver si se conectó correctamente.

  // callback
  connection.once('open', () => {
    console.log('🟢 DB Connection Successful')
  })

  connection.on('error', (error) => {
    console.error('❌ DB Connection Error:', error)
  })
}

export { connect }
