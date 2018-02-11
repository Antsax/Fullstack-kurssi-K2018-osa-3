const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const koko = `puhelinluettelossa ${persons.length} henkilön tiedot`
  res.send(koko + '<p></p>' + new Date())
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  henkilo = persons.filter(p => p.id === id)
  if (henkilo.length === 1) {
    res.json(henkilo)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === "" || body.number === "" || body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'missing name, number or both'})
  }

  else if (persons.filter(p => p.name === body.name).length > 0) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const newID = Math.floor(Math.random() * 100 + 10)
  const lisattava = {
    name: body.name,
    number: body.number,
    id: newID
  }

  persons = persons.concat(lisattava)
  res.json(lisattava)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
