const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  product: {
    type: String,
    default: 'Param Raksha Life'
  },
  sumAssured: {
    type: Number,
    required: true
  },
  policyTerm: {
    type: Number,
    required: true
  },
  calculatedPremium: {
    type: Number,
    required: true
  },
  fundValue: {
    type: Number,
    required: true
  },
  // Previous fields made optional to prevent breakage with older databases
  fv20: {
    type: Number,
    required: false
  },
  fv30: {
    type: Number,
    required: false
  },
  fv40: {
    type: Number,
    required: false
  },
  finalMaturity: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', LeadSchema);
