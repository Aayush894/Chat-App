import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    username: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    profilePic: {
      type: String,
      default:
        "https://imgs.search.brave.com/_QS-C_ZdFRoEEb83lITyO3dY1Y6syO6ywUb65b2ZRcQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/dzNzY2hvb2xzLmNv/bS9ob3d0by9pbWdf/YXZhdGFyLnBuZw",
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;