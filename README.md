## profiles



CREATE   POST /profiles
READ     GET /profiles/:id  - get a single profiles
UPDATE   PUT /profiles/:id
DELETE   DELETE /profiles/:id

GET /profiles?filter=authProfileID:somevalue - list all the profiles


Sample profile document:

```
  {
    _id: 'profile_xyz123',
    firstName: 'Garret',
    lastName: 'Eanes',
    email: 'frontiersons@gmail.com',
    dob: '1/2/1987',
    gender: 'M',
    bandName: 'Frontier Sons',
    genre: 'Rock',
    type: 'profile',
    photo: 'https://fillmurray/200/200',
    contacts: [
      {
        contact_id: 'contact_ian_dante_ian@redsicehouse.com',
        venue_id: 'reds_icehouse_charleston_sc_234153452jlj'
      },
      {
        contact_id: 'contact_zack_bennifield_zack@blacksheep.com',
        venue_id: 'venue_blacksheep_charleston_sc_24251t355234ewrq'
      },
      {
        contact_id: 'contact_dan_bladykis_dan@guitar.com',
        venue_id: 'venue_chucktown_sound_llc_charleston_sc_234jk24'
      }
    ]
  },
```
