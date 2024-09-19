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

// Get all cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).json({ message: 'Error Getting Cars', error })
  }
}

// Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId)
    res.status(200).json(car)
  } catch (error) {
    res.status(400).json({ message: 'Error Getting Car', error })
  }
}

// Update

// Delete

export {
  createCar,
  getAllCars,
  getCarById
}
