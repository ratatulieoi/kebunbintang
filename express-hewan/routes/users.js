var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Route yang hanya bisa diakses user yang login
router.get('/dashboard', isAuthenticated, function(req, res, next) {
  if (req.session.user.role === 'admin') {
    return res.redirect('/master');
  }
  res.render('user/dashboard', { 
    title: 'User Dashboard',
    user: req.session.user 
  });
});

module.exports = router;
