require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
let persons = [
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
]
const generateId = () => {
  return Math.floor(Math.random() * 100000)
}
app.use(cors())
app.use(express.json())
app.use(morgan('combined'))
app.use(express.static('dist'))

app.post('/api/persons', (req, res) => {
  const body = req.body
  const checkName = persons.find(item => item.name === body.name)
  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  } else if (checkName) {
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
  //res.json(person)
})
app.get('/api/persons', (req, res) => {
  Person.find({}).then(notes => res.status(200).json(notes))
  //res.json(persons)
})
app.get('/info', (req, res) => {
  const fecha = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${fecha.toString()}</p>
  `)
})
app.get('/api/persons/:id', (req, res) =>{
  //const id = Number(req.params.id)
  //const person = persons.find(p => p.id === id)
  /* person
  ? res.json(person) 
  : res.status(404).end() */

  Person.findById(req.params.id).then(pers => {
    res.status(200).json(pers)
  }).catch(err =>{
    console.log(`No se encontro el id : ${req.params.id}, el msj de error es el siguiente : ${err}`)
    res.status(404).end()
  })

})
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//https://fullstack-hy2024-backend-phonebook.onrender.com/