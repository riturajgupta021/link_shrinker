import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import "dotenv/config";

const signUp = async(req, res) => {
  try {
    const { email, name, password } = req.body;

    const chechUser = await User.findOne({ email });

    if (chechUser) {
      console.log("user already exist with this email");
      return res
        .status(400)
        .json({ success: false, message: "user had signed up already" });
    }

    const hashPassword = await argon2.hash(password);

    const user = new User({ name, email, password: hashPassword });

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Invalid credentials" });
  }
}; 

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("user is not present in database with this email");
      return res.status(400).json({ success: false, message: "Incorrect email or password" });
    }

    const isValidUser = await argon2.verify(user.password, password);

    if (!isValidUser) {
      console.log("Incorrect password");
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const accessToken = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_ACCESS_PASS,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_REFRESH_PASS,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("login successful");
    res.status(200).json({ success: true, message: "login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false , message: "login failed"});
  }
};

export { login, signUp };