function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
}

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).render('error-403', { 
        message: 'KAMU BUKAN ADMIN BOY acumalaka😂'
    });
}

module.exports = { isAuthenticated, isAdmin };