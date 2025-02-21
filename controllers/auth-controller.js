const User = require("../models/user");
const bcrypt = require("bcryptjs");
const register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, phone, password } = req.body;

    const useremailExist = await User.findOne({ email });
    const userphoneExist = await User.findOne({ phone });

    if (useremailExist) {
      return res.status(400).json({ msg: "Email already exists" });
    } else if (userphoneExist) {
      return res.status(400).json({ msg: "Phone number already exists" });
    }

    let baseUserName = name.trim().replace(/\s+/g, "").toLowerCase();
    let uniqueUserName;
    let usernameExists;
    do {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      uniqueUserName = `${baseUserName}${randomDigits}`;
      usernameExists = await User.findOne({ username: uniqueUserName });
    } while (usernameExists);

    const userCreated = await User.create({
      name,
      email,
      phone,
      password,
      username: uniqueUserName,
    });

    res.status(201).json({
      msg: "Registration successful",
      token: await userCreated.genrateToken(),
      My_: userCreated._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res) => {
  try {
    const user_email = req.body.email;
    const userExist = await User.findOne({ email: user_email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isauthenticated = await bcrypt.compare(
      req.body.password,
      userExist.password
    );
    if (isauthenticated) {
      const token = await userExist.genrateToken();
      console.log(userExist._id.toString());
      res.status(200).json({
        msg: "Login Successful",
        token: token,
        My_: userExist._id.toString(),
      });
    } else {
      return res.status(401).json({ msg: "invalid login and password" });
    }
  } catch (error) {
    next(error);
  }
};

const getUserDetail = async (req, res) => {
  try {
    const id = req.id;
    const userDetail = await User.findOne({ _id: id }).select({ password: 0 });
    return res.status(200).json(userDetail);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, Login, getUserDetail };
