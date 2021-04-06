const User = require("../models/User");
const ErroResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
  const {
    userName,
    email,
    password,
    firstName,
    lastName,
    birthDate,
  } = req.body;
  const access = 1;

  try {
    const user = await User.create({
      userName,
      email,
      password,
      firstName,
      lastName,
      birthDate,
      access,
    });

    console.log(user);

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErroResponse("Por favor ingresar el usuario y la contraseña.", 400)
    );
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErroResponse("Datos incorrectos", 401));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErroResponse("Datos incorrectos", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
