const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  town_hall: {type: Boolean, required: true, default: false},
  brunch : {type: Boolean, required: true, default: false},
  confirmed_town_hall: {type: Boolean, required: true, default: false},
  confirmed_brunch: {type: Boolean, required: true, default: false},
  family_members: {type: [String], required: false, default: []},
  notes: {type: String, required: false, default: null},
  selected_meal: {type: String, required: false, default: null},
  selected_music: {type: String, required: false, default: null},
})

const Guest = mongoose.model('Guest', GuestSchema);

export default Guest;
