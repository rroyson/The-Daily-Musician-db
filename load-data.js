require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

const profiles = [
  {
    _id: 'venue_reds_icehouse_charleston_sc_234153452jlj',
    venueName: 'Reds Icehouse',
    contactName: 'Ian Dante',
    contact_id: 'contact_ian_dante_ian@redsicehouse.com',
    address: '124 Coleman Blvd, Charleston, SC 29412',
    phone: '843-222-2222',
    email: 'ian@reds.com',
    photo: 'https://fillmurray/300/300',
    type: 'venue'
  },
  {
    _id: 'venue_smoke_bbq_charleston_sc_2142355234523j',
    venueName: 'Smoke BBQ',
    contactName: 'Michael Smoke',
    contact_id: 'contact_michael_smoke_michael@smokebbq.com',
    address: '1334 Coleman Blvd, Charleston, SC 29412',
    phone: '843-333-3333',
    email: 'smoke_michael@smokebbq.com',
    photo: 'https://fillmurray/300/300',
    type: 'venue'
  }

]

db.bulkDocs(profiles, function (err, res) {
  if (err) return console.log(err)
  console.log(res)
})

