const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const authRoutes = require('./authRoutes');

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(upload.array());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);

// SQLite database
const db = new sqlite3.Database('./backend/teleDoctor.db', (err) => {
    if (err) {
        console.error('Database opening error: ', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Example API endpoint (you can add your own)
app.get('/', (req, res) => {
    res.send('TeleHakim backend is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});