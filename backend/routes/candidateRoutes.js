const express = require('express');
const router = express.Router();
const {
  getAllCandidates,
  addCandidate,
  updateStatus,
  deleteCandidate,
  getStats
} = require('../controllers/candidateController');

router.get('/', getAllCandidates);
router.get('/stats', getStats);
router.post('/', addCandidate);
router.put('/:id/status', updateStatus);
router.delete('/:id', deleteCandidate);

module.exports = router;