const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (!process.argv[2]) {
  console.log("puhelinluettelo:")
  Person.find({}).then(persons => {
    persons.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })
}

else if (process.argv[2] && process.argv[3]) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })


  person
    .save()
    .then(result => {
      console.log(`lisätään henkilön ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
      mongoose.connection.close()
    })
}
