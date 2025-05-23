const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

router.get('/login', (req, res) => {
    res.render('auth/login', { messages: {} });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) throw err;
        
        if (results.length === 0) {
            return res.render('auth/login', {
                messages: { error: 'User not found' }
            });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.render('auth/login', {
                messages: { error: 'Invalid password' }
            });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        
        // Redirect berdasarkan role
        if (user.role === 'admin') {
            res.redirect('/master');
        } else {
            res.redirect('/users/dashboard');  // Redirect user biasa ke galeri
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;