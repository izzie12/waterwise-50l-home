const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  household: {
    people: Number,
    showerFrequency: Number,
    appliances: { 
      washingMachine: Boolean, 
      dishwasher: Boolean 
    }
  },
  preferences: { 
    notifications: Boolean 
  }
});

module.exports = mongoose.model('User', userSchema); 