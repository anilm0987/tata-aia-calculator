const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JSON File Database Fallback Helpers
const dbFilePath = path.join(__dirname, 'data', 'leads_db.json');

function initJsonDb() {
  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify([], null, 2), 'utf8');
  }
}

function getJsonLeads() {
  initJsonDb();
  try {
    const content = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading JSON DB file:', error);
    return [];
  }
}

function saveJsonLeads(leads) {
  initJsonDb();
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(leads, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to JSON DB file:', error);
  }
}

function createJsonLead(leadData) {
  const leads = getJsonLeads();
  const newLead = {
    _id: `json_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...leadData,
    createdAt: new Date().toISOString()
  };
  leads.push(newLead);
  // Sort descending by date (newest first)
  leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  saveJsonLeads(leads);
  return newLead;
}

function deleteJsonLead(id) {
  const leads = getJsonLeads();
  const initialLength = leads.length;
  const filtered = leads.filter(l => l._id !== id);
  if (filtered.length !== initialLength) {
    saveJsonLeads(filtered);
    return true;
  }
  return false;
}

// Database Connection
let useMongo = false;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tata-aia-calculator';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    useMongo = true;
  })
  .catch((err) => {
    console.warn('⚠️ WARNING: MongoDB connection failed or URI not provided.');
    console.warn(`Attempted URI: ${MONGODB_URI}`);
    console.warn('👉 Server will automatically fall back to local JSON database: server/data/leads_db.json');
    useMongo = false;
  });

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: useMongo ? 'MongoDB' : 'Local JSON Fallback',
    timestamp: new Date()
  });
});

// GET all leads (Newest first)
app.get('/api/leads', async (req, res) => {
  try {
    if (useMongo && mongoose.connection.readyState === 1) {
      const leads = await Lead.find().sort({ createdAt: -1 });
      return res.json(leads);
    } else {
      const leads = getJsonLeads();
      return res.json(leads);
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to retrieve customer leads.' });
  }
});

// POST save a new lead
app.post('/api/leads', async (req, res) => {
  try {
    const {
      name,
      dob,
      phone,
      age,
      product,
      sumAssured,
      policyTerm,
      calculatedPremium,
      fundValue,
      fv20,
      fv30,
      fv40,
      finalMaturity
    } = req.body;

    // Simple backend validations
    if (!name || !dob || !phone || !age || !sumAssured) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }

    const leadData = {
      name,
      dob: new Date(dob),
      phone,
      age: Number(age),
      product: product || 'Param Raksha Life',
      sumAssured: Number(sumAssured),
      policyTerm: Number(policyTerm),
      calculatedPremium: Number(calculatedPremium),
      fundValue: Number(fundValue),
      fv20: fv20 ? Number(fv20) : undefined,
      fv30: fv30 ? Number(fv30) : undefined,
      fv40: fv40 ? Number(fv40) : undefined,
      finalMaturity: finalMaturity ? Number(finalMaturity) : undefined
    };

    if (useMongo && mongoose.connection.readyState === 1) {
      const newLead = new Lead(leadData);
      await newLead.save();
      return res.status(201).json(newLead);
    } else {
      const newLead = createJsonLead(leadData);
      return res.status(201).json(newLead);
    }
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ error: 'Failed to save customer lead details.' });
  }
});

// DELETE a lead by ID
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (useMongo && mongoose.connection.readyState === 1) {
      const deletedLead = await Lead.findByIdAndDelete(id);
      if (!deletedLead) {
        return res.status(404).json({ error: 'Lead not found.' });
      }
      return res.json({ message: 'Lead deleted successfully.', id });
    } else {
      const success = deleteJsonLead(id);
      if (!success) {
        return res.status(404).json({ error: 'Lead not found.' });
      }
      return res.json({ message: 'Lead deleted successfully from local JSON database.', id });
    }
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete customer lead.' });
  }
});

// Serve static assets from React client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route to serve React Router's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✨ DB Mode: ${useMongo ? 'MongoDB' : 'JSON DB Fallback (Zero-Config)'}`);
});
