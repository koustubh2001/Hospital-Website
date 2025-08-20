const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  Age: Number,
  message: String,
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
