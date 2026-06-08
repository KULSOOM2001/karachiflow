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
    enum: ['active', 'verified', 'resolved', 'escalated'],
    default: 'active'
  },
  votes: { type: Number, default: 1 },
  voters: [{ type: String }],
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  officialUpdate: { type: String, default: '' },
  estimatedResolution: { type: String, default: '' },
  reporterName: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Priority calculation
  if (this.votes >= 5) this.priority = 'critical';
  else if (this.votes >= 3) this.priority = 'high';
  else if (this.votes >= 2) this.priority = 'medium';
  else this.priority = 'low';
  
  // Status auto-update ONLY for active reports
  if (this.status === 'active' && this.votes >= 3) {
    this.status = 'verified';
  }
  if (this.status === 'verified' && this.votes >= 5) {
    this.status = 'escalated';
  }
  
  next();
});

module.exports = mongoose.model('Report', reportSchema);
