import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const login = async (req, res) => {
    try {
      const {username, password} = req.body;

      if (!username || !password) {
        return res.status(400).json({message: "All fields are required"});
      }

      const user = await User.findOne({username});

      if (!user) {
        return res.status(400).json({message: "User does not exist"});
      }
      
      const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

      if (!isPasswordCorrect) {
        return res.status(400).json({message: "Invalid credentials"});
      }

      generateTokenAndSetCookie(user._id, res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        ProfilePic: user.ProfilePic,
        message: "User logged in successfully",
      });
    } catch (error) {
        console.log("Error in login User", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
  };

export const signup = async (req, res) => {
    try {
      const {fullName, username, password, confirmPassword, gender} = req.body;

      if (!fullName || !username || !password || !confirmPassword || !gender) {
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

      if (newUser) {

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          ProfilePic: newUser.ProfilePic,
          message: "User registered successfully",
        });
      } else {
        res.status(400).json({message: "Failed to register user"});
      }

    } catch (error) {
        console.log(error);
    }

  };

export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", {maxAge: 1});
      res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
      console.log("Error in logout User", error.message);
      res.status(500).json({message: "Internal Server Error"});
    }
  };

