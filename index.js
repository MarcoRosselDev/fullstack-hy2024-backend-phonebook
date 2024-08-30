require('dotenv').config()
const express = require('express')
//const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
/* let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
] */
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
app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  } else {
    Person.findOne({ name : body.name }).then(result => {
      console.log(result)
      if (result) {
        return res.status(400).json({ 
          error: 'name must be unique'
        })
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      //persons = persons.concat(person)
    
      person.save().then(savedNote => {
        res.status(201).json(savedNote)
      }).catch(err =>{
        console.log(`No se pudo guardar la persona, el msj de error es el siguiente : ${err}`)
        res.status(405).end()
      })
    })
  }
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

  const num = {
    name: body.name,
    number: body.number,
  }
  console.log(num, body.name, body.number, req.params.id);
  
  Person.findByIdAndUpdate(req.params.id, num, { new: true })
  .then(updatedNote =>{
    res.json(updatedNote)
  })
  .catch(error => {
    console.log(error, 'from put');
    
    next(error)
  })
    
})
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//https://fullstack-hy2024-backend-phonebook.onrender.com/