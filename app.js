require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const dal = require(`./dal`)
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const { pathOr, keys, path } = require('ramda')
const checkReqFields = require('./lib/check-fields')
const checkProfileFields = checkReqFields([
  'firstName',
  'lastName',
  'email',
  'dob',
  'bandName'
])
const checkUpdateProfileFields = checkReqFields([
  '_id',
  '_rev',
  'type',
  'firstName',
  'lastName',
  'email',
  'dob',
  'bandName'
])

const checkContactFields = checkReqFields([
  'firstName',
  'lastName',
  'email',
  'company'
])

const checkUpdateContactFields = checkReqFields([
  'firstName',
  'lastName',
  'email',
  'company',
  '_id',
  '_rev',
  'type'
])

const checkVenueFields = checkReqFields([
  'venueName',
  'address',
  'contactName',
  'phone'
])

const checkUpdateVenueFields = checkReqFields([
  'venueName',
  'address',
  'contactName',
  'phone',
  '_id',
  '_rev',
  'type'
])

app.use(cors({ credentials: true }))

app.use(bodyParser.json())

app.get('/', function (req, res, next) {
  res.send('Welcome to the Daily Musician API. Manage your career.')
})

// PROFILES

// CREATE
app.post('/profiles', function (req, res, next) {
  const profile = pathOr(null, ['body'], req)
  const fieldResults = checkProfileFields(profile)

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields', { fields: fieldResults })
    )
  }
  dal.createProfile(profile, function (err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})
// READ
app.get('/profiles/:id', function (req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)

  if (id) {
    dal.showProfile(id, function (err, doc) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(doc)
    })
  } else {
    return next(new HTTPError(400, 'Missing id in path'))
  }
})

// UPDATE
app.put('/profiles/:id', function (req, res, next) {
  const profile = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)

  const fieldResults = checkUpdateProfileFields(body)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing profile in request body'))

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields: ', {
        fields: fieldResults
      })
    )
  }

  dal.updateProfile(body, function (err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// DELETE
app.delete('/profiles/:id', function (req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)

  dal.deleteProfile(id, function (err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

// LIST
app.get('/profiles', function (req, res, next) {
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listProfiles(filter, lastItem, Number(limit), function (err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// CONTACTS

// CREATE
app.post('/profiles/:id/contacts', function (req, res, next) {
  const id = pathOr(null, ['profile', '_id'], req)
  const contact = pathOr(null, ['body'], req)
  const fieldResults = checkContactFields(contact)

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields', { fields: fieldResults })
    )
  }
  dal.createContact(contact, function (err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})

// READ
app.get('/profiles/:id/contacts/:contactId', function (req, res, next) {
  const contactId = pathOr(null, ['params', 'contactId'], req)

  if (contactId) {
    dal.showContact(contactId, function (err, doc) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(doc)
    })
  } else {
    return next(new HTTPError(400, 'Missing id in path'))
  }
})

// UPDATE
app.put('/profiles/:id/contacts/:contactId', function (req, res, next) {
  const contact = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)

  const fieldResults = checkUpdateContactFields(body)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing contact in request body'))

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields: ', {
        fields: fieldResults
      })
    )
  }

  dal.updateContact(body, function (err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// DELETE
app.delete('/profiles/:id/contacts/:contactId', function (req, res, next) {
  const contactId = pathOr(null, ['params', 'contactId'], req)
  if (contactId) {
    dal.deleteContact(contactId, function (err, result) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(result)
    })
  } else {
    return next(new HTTPError(400, 'Missing id in path'))
  }
})

// LIST
app.get('/profiles/:id/contacts', function (req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listContacts(id, filter, lastItem, Number(limit), function (err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// VENUES

// CREATE
app.post('/venues', function (req, res, next) {
  const venue = pathOr(null, ['body'], req)
  const fieldResults = checkVenueFields(venue)

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields', { fields: fieldResults })
    )
  }
  dal.createVenue(venue, function (err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})

// READ
app.get('/venues/:id', function (req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)

  if (id) {
    dal.showVenue(id, function (err, doc) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(doc)
    })
  } else {
    return next(new HTTPError(400, 'Missing id in path'))
  }
})

// UPDATE
app.put('/venues/:id', function (req, res, next) {
  const venue = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)

  const fieldResults = checkUpdateVenueFields(body)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing venue in request body'))

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields: ', {
        fields: fieldResults
      })
    )
  }

  dal.updateVenue(body, function (err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// DELETE
app.delete('/venues/:id', function (req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)

  dal.deleteVenue(id, function (err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

// LIST
app.get('/venues', function (req, res, next) {
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listVenues(filter, lastItem, Number(limit), function (err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// ERROR MIDDLEWARE
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('Api is up on port: ', port))
