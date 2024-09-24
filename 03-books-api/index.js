import express from 'express'
import { connect } from './config/database.js'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Aqui van las rutas

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT} 🚀`)
  })
})
