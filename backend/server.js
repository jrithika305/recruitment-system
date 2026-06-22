const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'HireAI Backend is running!' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get('/api/resume', (req, res) => {
  res.json({ message: 'Resume API is working!' });
});

app.post('/api/resume/upload', upload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }
    res.json({
      message: 'Resume uploaded successfully!',
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/resume/download/:filename', (req, res) => {
  var filename = req.params.filename;
  var filepath = path.join(__dirname, 'uploads', filename);
  res.download(filepath, function(err) {
    if (err) {
      res.status(404).json({ message: 'File not found!' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});