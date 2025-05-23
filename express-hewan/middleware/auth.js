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
    res.status(403).render('error', { 
        message: 'KAMU BUKAN ADMIN BOY acumalaka😂',
        error: { status: 403 }
    });
}

module.exports = { isAuthenticated, isAdmin };