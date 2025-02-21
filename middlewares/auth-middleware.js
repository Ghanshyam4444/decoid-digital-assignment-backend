const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(400).send({ msg: "token is not available" });
  }
  const jwtToken = token.replace("Bearer ", "").trim();
  try {
    const userExist = await jwt.verify(jwtToken, "thisisasecretkey");
    const userData = await User.findOne({ email: userExist.email }).select({
      password: 0,
    });

    req.user = userData;
    req.token = jwtToken;
    req.id = userData._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};
module.exports = authMiddleware;
