const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin login - password stored in env (hashed in production)
const login = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const isMatch = password === process.env.ADMIN_PASSWORD;
    // In production use: await bcrypt.compare(password, hashedPassword)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyToken = (req, res) => {
  // If middleware passes, token is valid
  res.json({ valid: true, role: req.admin.role });
};

module.exports = { login, verifyToken };
