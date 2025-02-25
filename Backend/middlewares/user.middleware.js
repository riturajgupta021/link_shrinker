import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const checkForToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    try {
      console.log("In the If Part");
      const decode = jwt.verify(accessToken, process.env.JWT_ACCESS_PASS);

      const user = await User.findOne({ _id: decode.id });

      req.user = user;

      next();
    } catch (error) {
      console.log("invalid access token");
      res.status(401).json({ message: "Unauthorized Access" });
    }
  } else {
    console.log("In the else Part");
    try {
      const refreshToken = req.cookies["refreshToken"];

      if (!refreshToken) {
        console.log("Neither Access nor Refresh token is present");
        return res.status(401).json({ message: "Unauthorized Access" });
      }

      const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_PASS);

      const newAccessToken = jwt.sign(
        { id: decode.id, name: decode.name },
        process.env.JWT_ACCESS_PASS,
        { expiresIn: "1h" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 60 * 60 * 1000,
      });

      const user = await User.findOne({ _id: decode.id });

      req.user = user;

      next();
    } catch (error) {
      console.log("invalid refresh token");
      res.status(401).json({ message: "Unauthorized Access" });
    }
  }
};


export { checkForToken };
