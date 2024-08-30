require('dotenv').config()
const mongoose = require('mongoose')

const URL = process.env.URL

mongoose.set('strictQuery',false)
mongoose.connect(URL)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', numberSchema)

/* const person = new Person({
  name: 'marco rossel',
  number: '1 9071 178 120',
})
 */
Person.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

/* person.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}) */