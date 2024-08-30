require('dotenv').config()
const express = require('express')
//const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
//app.use(morgan('combined'))
app.use(express.static('dist'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(notes => res.status(200).json(notes))
})
app.get('/info', (req, res) => {
  const fecha = new Date()
  Person.countDocuments({}).then(length => {
    res.send(`
      <p>Phonebook has info for ${length} people</p>
      <p>${fecha.toString()}</p>
    `)  
  })
})
app.get('/api/persons/:id', (req, res) =>{
  Person.findById(req.params.id).then(pers => {
    if(pers) {
      res.status(200).json(pers)
    } else{
      res.status(404).end()
    }
  }).catch(error => next(error))

})
// number validation
const regex = /^(\d{2}|\d{3})-(\d{7}|\d{8})$/
const testInput = str => regex.test(str)

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  
  Person.findOne({ name : body.name }).then(result => {
    if (result) {
      return res.status(400).json({ 
        error: 'name must be unique'
      })
    }
    if(testInput(body.number)){
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save()
      .then(savedNote => res.status(201).json(savedNote))
      .catch(error => next(error))
    } else{
      return res.status(400).json({error: 'Invalid phone number format'})
    }
  })
})
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    res.status(204).json(result)
  })
  .catch(error => next(error))
})
app.put('/api/persons/:id', (req, res, next) =>{
  const body = req.body
  if (testInput(body.number)) {
    const num = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(req.params.id, num, { new: true })
    .then(updatedNote => res.json(updatedNote))
    .catch(error => next(error))
  } else{
    return res.status(400).json({error: 'Invalid phone number format'})
  }

})
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, req, res, next) => {

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//https://fullstack-hy2024-backend-phonebook.onrender.com/