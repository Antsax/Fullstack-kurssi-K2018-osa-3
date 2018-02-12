const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
morgan.token('type', (req, res) => {return JSON.stringify(req.body)})

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

let persons = [
  {
   name: "Arto Hellas",
   number: "040-123456",
   id: 1
  },
  {
   name: "Martti Tienari",
   number: "040-123456",
   id: 2
  },
  {
   name: "Arto Järvinen",
   number: "040-123456",
   id: 3
  },
  {
   name: "Lea Kutvonen",
   number: "040-123456",
   id: 4
  }
]

const formatPerson = (person) => {
  const formattedPerson = {...person._doc, id: person._id}
  delete formattedPerson._id
  delete formattedPerson.__v
  return formattedPerson
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(formatPerson))
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(array => {res.json('puhelinluettelossa '  + array.length +  ' henkilön tiedot ' + new Date())})
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(formatPerson(person))
      } else {
        res.status(404).end()
      }
    }).catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id'})
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === "" || body.number === "" || body.name === undefined || body.number === undefined) {
    return res.status(400).send({error: 'missing name, number or both'})
  }

  Person.find({name: body.name}).then(result => {
    if (result.length===0) {
      const person = new Person ({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPerson => {
        res.json(formatPerson(savedPerson))
      })
    } else {
      res.status(400).send({ error: 'that person already exists'})
    }
  })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
          res.json(formatPerson(updatedPerson))
        }).catch(error => {
          console.log(error)
          res.status(400).send({ error: 'malformatted id'})
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
