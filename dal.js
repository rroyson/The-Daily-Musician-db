const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const HTTPError = require('node-http-error')
const buildPk = require('./lib/build-pk')
const generateProfilePk = buildPk('profile_')
const generateContactPk = buildPk('contact_')
const generateVenuePk = buildPk('venue_')
const { pathOr, assoc, split, head, last } = require('ramda')

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
  const pk = generateContactPk(`${firstName}_${lastName}_${email}`)

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

//////READ

//////UPDATE

//////DELETE

//////LIST

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
  listContacts
}

module.exports = dal