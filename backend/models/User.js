const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // New field to store onboarding answers
  onboardingAnswer: {
    type: String,
    default: '',
  },
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
