import express from 'express'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Aqui van las rutas

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`)
})
