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

const test = callback => {
  callback(null, 'dal is ok')
}

////////////////////
////////PROFILES
////////////////////

//////CREATE
const createProfile = (profile, callback) => {
  const firstName = pathOr('', ['firstName'], profile)
  const lastName = pathOr('', ['lastName'], profile)
  const email = pathOr('', ['email'], profile)
  const pk = generateProfilePk(`${firstName}_${lastName}_${email}`)

  profile = assoc('_id', pk, profile)
  profile = assoc('type', 'profile', profile)

  createDoc(profile, callback)
}
//////READ
const showProfile = (id, callback) => {
  db.get(id, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'profile'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Document is not a profile'))
  })
}
//////UPDATE
function updateProfile(profile, callback) {
  profile = assoc('type', 'profile', profile)
  createDoc(profile, callback)
}
//////DELETE
function deleteProfile(id, callback) {
  db
    .get(id)
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .then(err => callback(err))
}

///////LIST
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

  find(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

////////////////////
///CONTACTS
///////////////////

//////CREATE
const createContact = (contact, callback) => {
  const firstName = pathOr('', ['firstName'], contact)
  const lastName = pathOr('', ['lastName'], contact)
  const email = pathOr('', ['email'], contact)
  const profileId = pathOr('', ['profileId'], contact)
  console.log('profileId', profileId)
  console.log('contact', contact)
  const pk = generateContactPk(`${profileId}${firstName}_${lastName}_${email}`)

  console.log('pk', pk)

  contact = assoc('_id', pk, contact)
  contact = assoc('type', 'contact', contact)

  createDoc(contact, callback)
}

//////READ
const showContact = (id, callback) => {
  db.get(id, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'contact'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Document is not a contact'))
  })
}

//////UPDATE
function updateContact(contact, callback) {
  contact = assoc('type', 'contact', contact)
  createDoc(contact, callback)
}

//////DELETE
function deleteContact(id, callback) {
  db
    .get(id)
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .then(err => callback(err))
}

//////LIST
function listContacts(filter, lastItem, limit, callback) {
  //   const getProfileId = id => {
  //     db.get(id).then(docs => callback(null, docs)).catch(err => callback(err))
  //   }
  // }

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
        type: 'contact'
      },
      limit
    }
  } else {
    query = {
      selector: {
        _id: { $gte: null },
        type: 'contact'
      },
      limit
    }
  }

  find(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

////////////////////
///VENUES
///////////////////

//////CREATE
const createVenue = (venue, callback) => {
  const name = pathOr('', ['venueName'], venue)
  const address = pathOr('', ['address'], venue)
  const pk = generateVenuePk(`${name}_${address}`)
  console.log('pk', pk)

  venue = assoc('_id', pk, venue)
  venue = assoc('type', 'venue', venue)

  createDoc(venue, callback)
}

//////READ
const showVenue = (id, callback) => {
  db.get(id, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'venue'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Document is not a venue'))
  })
}

//////UPDATE
function updateVenue(venue, callback) {
  venue = assoc('type', 'venue', venue)
  createDoc(venue, callback)
}

//////DELETE
function deleteVenue(id, callback) {
  db
    .get(id)
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .then(err => callback(err))
}

//////LIST
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

  find(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

////////////////////
///HELPER FUNCTIONS
///////////////////

function createDoc(doc, callback) {
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

function find(query, callback) {
  query ? db.find(query, callback) : callback(null, [])
}

const dal = {
  test,
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
