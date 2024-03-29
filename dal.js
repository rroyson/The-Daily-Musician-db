const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const HTTPError = require('node-http-error')
const buildPk = require('./lib/build-pk')
const generateProfilePk = buildPk('profile_')
const generateContactPk = buildPk('contact_')
const generateVenuePk = buildPk('venue_')
const { pathOr, assoc, split, head, last } = require('ramda')
const uuidv4 = require('uuid/v4')
const uuid = uuidv4()

// PROFILES

// CREATE
const createProfile = (profile, callback) => {
  const { firstName, lastName, email } = profile
  const pk = generateProfilePk(`${firstName}_${lastName}_${email}`)

  profile = assoc('_id', pk, profile)
  profile = assoc('type', 'profile', profile)

  createDoc(profile, callback)
}

// READ
const showProfile = (id, callback) => {
  db.get(id, function (err, doc) {
    if (err) return callback(err)

    doc.type === 'profile'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Document is not a profile'))
  })
}

// UPDATE
function updateProfile(profile, callback) {
  profile = assoc('type', 'profile', profile)
  createDoc(profile, callback)
}

// DELETE
function deleteProfile(id, callback) {
  db
    .get(id)
    .then(
      doc =>
        doc.type === 'profile'
          ? doc
          : callback(new HTTPError(400, 'Document is not a profile'))
    )
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .then(err => callback(err))
}

// LIST
function listProfiles(filter, lastItem, limit, callback) {
  var query = {}
  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)

    const selectorValue = assoc(filterField, filterValue, {})
    query = {
      selector: selectorValue,
      limit
    }
  } else if (lastItem) {
    query = {
      selector: {
        _id: { $gt: lastItem },
        type: 'profile'
      },
      limit
    }
  } else {
    query = {
      selector: {
        _id: { $gte: null },
        type: 'profile'
      },
      limit
    }
  }

  find(query, function (err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

// CONTACTS

// CREATE
const createContact = (contact, callback) => {
  const { firstName, lastName, email, profileId } = contact
  const pk = generateContactPk(`${profileId}_${firstName}_${lastName}_${email}`)

  contact = assoc('_id', pk, contact)
  contact = assoc('type', 'contact', contact)

  createDoc(contact, callback)
}

// READ
const showContact = (id, callback) => {
  db.get(id, function (err, doc) {
    if (err) return callback(err)

    doc.type === 'contact'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Document is not a contact'))
  })
}

// UPDATE
function updateContact(contact, callback) {
  contact = assoc('type', 'contact', contact)
  createDoc(contact, callback)
}

// DELETE
function deleteContact(contactId, callback) {
  db
    .get(contactId)
    .then(
      doc =>
        doc.type === 'contact'
          ? doc
          : callback(new HTTPError(400, 'Document is not a contact'))
    )
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .catch(err => callback(err))
}

// LIST
function listContacts(profileId, filter, lastItem, limit, callback) {
  limit = limit ? limit : 5
  let query = {}

  if (profileId) {
    query = {
      selector: {
        type: 'contact',
        profileId
      },
      limit
    }
  }

  find(query, function (err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

// VENUES

// CREATE
const createVenue = (venue, callback) => {
  const name = pathOr('', ['venueName'], venue)
  const address = pathOr('', ['address'], venue)
  const pk = generateVenuePk(`${name}_${address}`)

  venue = assoc('_id', pk, venue)
  venue = assoc('type', 'venue', venue)

  createDoc(venue, callback)
}

// READ
const showVenue = (id, callback) => {
  db.get(id, function (err, doc) {
    if (err) return callback(err)

    doc.type === 'venue'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Document is not a venue'))
  })
}

// UPDATE
function updateVenue(venue, callback) {
  venue = assoc('type', 'venue', venue)
  createDoc(venue, callback)
}

// DELETE
function deleteVenue(id, callback) {
  db
    .get(id)
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .then(err => callback(err))
}

// LIST
function listVenues(filter, lastItem, limit, callback) {
  var query = {}
  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)

    const selectorValue = assoc(filterField, filterValue, {})
    query = {
      selector: selectorValue,
      limit
    }
  } else if (lastItem) {
    query = {
      selector: {
        _id: { $gt: lastItem },
        type: 'venue'
      },
      limit
    }
  } else {
    query = {
      selector: {
        _id: { $gte: null },
        type: 'venue'
      },
      limit
    }
  }

  find(query, function (err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

// HELPERS
function createDoc(doc, callback) {
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

function find(query, callback) {
  query ? db.find(query, callback) : callback(null, [])
}

const dal = {
  createProfile,
  showProfile,
  updateProfile,
  deleteProfile,
  listProfiles,
  createContact,
  showContact,
  updateContact,
  deleteContact,
  listContacts,
  createVenue,
  showVenue,
  updateVenue,
  deleteVenue,
  listVenues
}

module.exports = dal
