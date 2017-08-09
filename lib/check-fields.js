const { difference, keys } = require('ramda')

module.exports = profileKeys => data => difference(profileKeys, keys(data))
