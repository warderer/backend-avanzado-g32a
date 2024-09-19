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
    const cars = await Car.find({ isActive: true })
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).json({ message: 'Error Getting Cars', error })
  }
}

// Get car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById({ _id: req.params.carId, isActive: true })
    res.status(200).json(car)
  } catch (error) {
    res.status(400).json({ message: 'Error Getting Car', error })
  }
}

// Update
const updateCarById = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.carId, req.body, { new: true })
    res.status(200).json(updatedCar)
  } catch (error) {
    res.status(400).json({ message: 'Error Updating Car', error })
  }
}

// Delete

const deleteCarById = async (req, res) => {
  // Borrado físico: Voy a comprobar si existe un query string llamado 'destroy' y si su valor es 'true' ?destroy=true
  if (req.query.destroy === 'true') {
    try {
      const deletedCar = await Car.findByIdAndDelete(req.params.carId)
      if (deletedCar === null) { // Valido si el carro existe
        return res.status(404).json({ message: 'Car not found for Delete' })
      }
      return res.status(204).json()
    } catch (error) {
      return res.status(400).json({ message: 'Error Deleting Car', error })
    }
  }

  // Borrado lógico: Actualizar isActive a false
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.carId, { isActive: false }, { new: false })
    if (updatedCar === null || updatedCar.isActive === false) { // Valido si el carro existe
      return res.status(404).json({ message: 'Car not found for Delete' })
    }
    return res.sendStatus(204)
  } catch (error) {
    return res.status(400).json({ message: 'Error Deleting Car', error })
  }
}

export {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById
}
