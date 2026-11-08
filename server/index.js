require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/db-test', async(req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ connected: true, time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ connected: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));