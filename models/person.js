const URL = process.env.URL
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose
  .connect(URL)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

/* const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
 */
const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
  },
})

numberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', numberSchema)
