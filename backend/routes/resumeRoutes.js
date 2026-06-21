const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.json({ message: 'Resume API is working!' });
});

router.post('/upload/:candidateId', upload.single('resume'), (req, res) => {
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

router.get('/download/:filename', (req, res) => {
  var filename = req.params.filename;
  var filepath = path.join(__dirname, '../uploads/', filename);
  res.download(filepath, function(err) {
    if (err) {
      res.status(404).json({ message: 'File not found!' });
    }
  });
});

module.exports = router;