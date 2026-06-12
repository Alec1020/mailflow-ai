const User = require('../models/User');
// const jwt = require('jsonwebtoken');

const {
  generateAccessToken,
  generateRefreshToken
} = require('../utils/generateTokens');

// Generate JWT
// const generateToken = (id, secret, expiresIn) => {
//   return jwt.sign({ id }, secret, { expiresIn });
// };

// Register
exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ firstName, lastName, email, password });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(204);

  user.refreshToken = '';
  await user.save();

  res.clearCookie('refreshToken');
  res.sendStatus(200);
};

//GET Current User
exports.getMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  res.json(req.user);
};