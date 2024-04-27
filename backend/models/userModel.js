const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://imgs.search.brave.com/f24VFJu6T9XIjpQVceZV2T831KPw0b_-OjCqCeHDEFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC81My80Mi91/c2VyLW1lbWJlci1h/dmF0YXItZmFjZS1w/cm9maWxlLWljb24t/dmVjdG9yLTIyOTY1/MzQyLmpwZw",
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;