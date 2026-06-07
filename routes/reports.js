const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Report = require('../models/Report');
const { adminAuth } = require('../middleware/auth');

// Validate MongoDB ObjectId
function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: 'Invalid report ID' });
  }
  next();
}

// GET all active reports (optionally filter by zone)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.zone) filter.zone = req.query.zone;
    if (req.query.type) filter.type = req.query.type;
    const reports = await Report.find(filter).sort({ votes: -1, createdAt: -1 }).limit(50);
    res.json({ success: true, reports });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET zone summary for heatmap
router.get('/zones', async (req, res) => {
  try {
    const zones = await Report.aggregate([
      { $match: { status: { $ne: 'resolved' } } },
      { $group: {
        _id: '$zone',
        totalReports: { $sum: 1 },
        totalVotes: { $sum: '$votes' },
        loadShedding: { $sum: { $cond: [{ $eq: ['$type', 'load_shedding'] }, 1, 0] } },
        waterShortage: { $sum: { $cond: [{ $in: ['$type', ['water_shortage', 'tanker_unavailable']] }, 1, 0] } },
        hasEscalated: { $max: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] } }
      }},
      { $sort: { totalVotes: -1 } }
    ]);
    res.json({ success: true, zones });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET single report
router.get('/:id', validateId, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, report });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST new report
router.post('/', async (req, res) => {
  try {
    const { type, zone, description, reporterName } = req.body;
    if (!type || !zone) return res.status(400).json({ success: false, error: 'type and zone required' });
    const report = new Report({ type, zone, description, reporterName });
    await report.save();
    res.status(201).json({ success: true, report });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PATCH vote on a report
router.patch('/:id/vote', validateId, async (req, res) => {
  try {
    const { voterId } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });
    if (report.voters.includes(voterId)) {
      return res.status(400).json({ success: false, error: 'Already voted' });
    }
    report.voters.push(voterId);
    report.votes += 1;
    await report.save();
    res.json({ success: true, votes: report.votes, priority: report.priority, status: report.status });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// PATCH resolve/escalate (admin)
router.patch('/:id/status', validateId, async (req, res) => {
  try {
    const { status, officialUpdate, estimatedResolution } = req.body;
    const update = { status, updatedAt: new Date() };
    if (officialUpdate) update.officialUpdate = officialUpdate;
    if (estimatedResolution) update.estimatedResolution = estimatedResolution;
    const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, report });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET admin: all reports including resolved
router.get('/admin/all', async (req, res) => {
  try {
    const reports = await Report.find().sort({ priority: -1, createdAt: -1 }).limit(100);
    res.json({ success: true, reports });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
// DELETE report
router.delete('/:id', validateId, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
module.exports = router;