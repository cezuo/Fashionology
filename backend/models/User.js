import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // New field to store onboarding answers
  onboardingAnswer: {
    type: String,
    default: "",
  },
});

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
