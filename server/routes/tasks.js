const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // كل الـ routes هنا محتاجة تسجيل دخول

// GET /api/tasks
router.get('/', async(req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/tasks
router.post('/', async(req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const result = await pool.query(
            'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *', [req.userId, title, description || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/tasks/:id
router.put('/:id', async(req, res) => {
    try {
        const { title, description, completed } = req.body;
        const result = await pool.query(
            `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           completed = COALESCE($3, completed)
       WHERE id = $4 AND user_id = $5
       RETURNING *`, [title, description, completed, req.params.id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async(req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;