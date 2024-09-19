import Car from '../models/Car.js'

// Create
const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body)
    res.status(201).json(car)
  } catch (error) {
    res.status(400).json({ message: 'Error creating car', error })
  }
}

// Read

// Update

// Delete

export {
  createCar
}
