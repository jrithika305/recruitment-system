const Candidate = require('../models/Candidate');

// ── GET ALL CANDIDATES ──
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── ADD CANDIDATE ──
exports.addCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json({ message: 'Candidate added successfully!', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── UPDATE CANDIDATE STATUS ──
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ message: 'Status updated!', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── DELETE CANDIDATE ──
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.json({ message: 'Candidate deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── GET STATS ──
exports.getStats = async (req, res) => {
  try {
    const total = await Candidate.countDocuments();
    const selected = await Candidate.countDocuments({ status: 'selected' });
    const rejected = await Candidate.countDocuments({ status: 'rejected' });
    const screening = await Candidate.countDocuments({ status: 'screening' });
    const applied = await Candidate.countDocuments({ status: 'applied' });
    res.json({ total, selected, rejected, screening, applied });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};