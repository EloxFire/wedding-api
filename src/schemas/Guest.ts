const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  is_coming: {type: Boolean, required: false, default: null},
  is_coming_brunch: {type: Boolean, required: false, default: null},
  is_invited_brunch: {type: Boolean, required: false, default: false},
  selected_meal: {type: String, required: false, default: null},
  selected_music: {type: String, required: false, default: null},
})

const Guest = mongoose.model('Guest', GuestSchema);

export default Guest;
