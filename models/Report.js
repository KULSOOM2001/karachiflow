const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['load_shedding', 'water_shortage', 'tanker_unavailable'],
    required: true
  },
  zone: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['active', 'verified', 'resolved', 'escalated', 'flagged'],
    default: 'active'
  },
  votes: { type: Number, default: 1 },
  voters: [{ type: String }],
  disagreeVotes: { type: Number, default: 0 },
  disagreeVoters: [{ type: String }],
  isFlagged: { type: Boolean, default: false },
  flaggedAt: { type: Date, default: null },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  officialUpdate: { type: String, default: '' },
  estimatedResolution: { type: String, default: '' },
  reporterName: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Priority calculation based on votes
  if (this.votes >= 20) this.priority = 'critical';
  else if (this.votes >= 10) this.priority = 'high';
  else if (this.votes >= 5) this.priority = 'medium';
  else this.priority = 'low';
  
  // Status auto-update ONLY for active reports (based on votes)
  if (this.status === 'active' && this.votes >= 3) {
    this.status = 'verified';
  }
  if (this.status === 'verified' && this.votes >= 10) {
    this.status = 'escalated';
  }
  
  // ========== FLAGGING LOGIC ==========
  // Auto-flag if 3+ disagree votes
  if (this.disagreeVotes >= 3) {
    this.isFlagged = true;
    this.flaggedAt = new Date();
    // Only change status to flagged if it's active or verified
    if (this.status === 'active' || this.status === 'verified') {
      this.status = 'flagged';
    }
  }
  
  // Auto-clear flag if disagree votes drop below threshold (for admin cleared)
  if (this.disagreeVotes < 3 && this.isFlagged === true) {
    this.isFlagged = false;
    this.flaggedAt = null;
    // Restore previous status if it was flagged
    if (this.status === 'flagged') {
      // Restore based on vote count
      if (this.votes >= 10) this.status = 'escalated';
      else if (this.votes >= 3) this.status = 'verified';
      else this.status = 'active';
    }
  }
  
  // Flag based on ratio (disagree > agree * 2) - for controversial reports
  if (this.disagreeVotes >= 2 && this.disagreeVotes > this.votes * 2) {
    this.isFlagged = true;
    this.flaggedAt = new Date();
    if (this.status === 'active' || this.status === 'verified') {
      this.status = 'flagged';
    }
  }
  
  // Ensure status consistency for resolved reports
  if (this.status === 'resolved') {
    this.isFlagged = false;
    this.flaggedAt = null;
  }
  
  next();
});

// Add an index for faster flagged queries
reportSchema.index({ isFlagged: 1, createdAt: -1 });
reportSchema.index({ status: 1, priority: -1 });
reportSchema.index({ zone: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);