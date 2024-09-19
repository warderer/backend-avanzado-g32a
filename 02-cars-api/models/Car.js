import mongoose from 'mongoose'

/**
 * 1.- Crear un schema (esqueleto) ✅
 * 2.- Crear modelo, asignando un nombre ✅
 * 3.- Exportar el modelo ✅
 */

const carSchema = new mongoose.Schema({
  // Campo: tipo de dato || Campo: { tipo de dato, restricciones }
  plate: { type: String, required: true, unique: true }, // No. de Placa
  year: { type: Number, required: true }, // Año
  model: { type: String, required: true }, // Modelo
  brand: { type: String, required: true }, // Marca
  version: String,
  color: {
    type: String,
    required: true,
    enum: ['red', 'blue', 'black', 'white', 'silver', 'gray', 'green', 'yellow', 'orange', 'brown', 'purple', 'pink', 'gold']
  },
  carType: {
    type: String,
    required: true,
    enum: ['sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'minivan', 'sport', 'luxury', 'crossover', 'hybrid', 'electric', 'wagon', 'classic', 'compact']
  },
  vin: { type: String, required: true, unique: true }, // Número de identificación del vehículo
  newCar: { type: Boolean, required: true }, // ¿Es un auto nuevo?
  isActive: { type: Boolean, default: true } // ¿Esta activo?
})

// Creamos el modelo en base al schema, siempre en SINGULAR (mongo lo pluraliza en la DB)
const Car = mongoose.model('Car', carSchema)

export default Car
