const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../emailService');

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address!' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken,
      verificationExpires
    });

    await user.save();

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({ 
      message: 'Account created! Please check your email to verify your account.' 
    });

  } catch (error) {
    console.log('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── VERIFY EMAIL ──
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ 
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link!' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.send(`
      <html>
        <body style="font-family:Arial;text-align:center;padding:50px;background:#F8FAFC;">
          <div style="max-width:400px;margin:0 auto;background:white;padding:40px;border-radius:12px;border:1px solid #E2E8F0;">
            <div style="font-size:60px;">✅</div>
            <h2 style="color:#1E293B;">Email Verified!</h2>
            <p style="color:#64748B;">Your HireAI account has been verified successfully.</p>
            <a href="https://recruitment-system-iota.vercel.app/login.html" 
               style="background:#2563EB;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:16px;">
              Login Now
            </a>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address!' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email!' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first! Check your inbox.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password!' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};