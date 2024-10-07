// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, phoneNumber });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Something Went Wrong !" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrUpdateUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, budget } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });

    if (user) {
      // If the user exists, update the user
      user.name = name;
      user.password = password;
      user.phoneNumber = phoneNumber;
      user.budget = budget;

      user = await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } else {
      // If the user does not exist, create a new user
      user = new User({ name, email, password, phoneNumber, budget });

      user = await user.save();
      res.status(201).json({ message: "User created successfully", user });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating or updating user", error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    // const users = await User.find().select("-password");

    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
