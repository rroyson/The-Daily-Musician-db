require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .createIndex({
    index: {
      fields: ['type', 'profileId']
    }
  })
  .then(function(result) {
    console.log(result)
  })
  .catch(function(err) {
    console.log(err)
  })
