import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const login = (req, res) => {
    res.send("Login User");
  };

export const signup = async (req, res) => {
    try {
      const {fullName, username, password, confirmPassword, gender} = req.body;

      if (!fullName || !username || !password || !confirmPassword || gender) {
        return res.status(400).json({message: "All fields are required"});
      }

      if (password !== confirmPassword) {
        return res.status(400).json({message: "Passwords do not match"});
      }

      const user = await User.findOne({username});

      if (user) {
        return res.status(400).json({message: "User already exists"});
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // https://avatar-placeholder.iran.liara.run/

      const boyProfilePic = "https://avatar.iran.liara.run/public/boy?username=${username}";
      const girlProfilePic = "https://avatar.iran.liara.run/public/girl?username=${username}";

      const newUser = new User({
        fullName,
        username,
        password: hashedPassword,
        gender,
        ProfilePic: gender === 'male' ? boyProfilePic : girlProfilePic
      });

      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        ProfilePic: newUser.ProfilePic,
        message: "User registered successfully"
      });

    } catch (error) {
        console.log(error);
    }

  };

export const logout = (req, res) => {
    res.send("Logout User");
  };

