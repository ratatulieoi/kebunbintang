var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/db');
const session = require('express-session');
const authRouter = require('./routes/auth');
const { isAuthenticated, isAdmin } = require('./middleware/auth');

var usersRouter = require('./routes/users');
var masterRouter = require('./routes/master');
var lihatRouter = require('./routes/melihat/lihat_index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // Menghapus maxAge agar cookie hilang saat browser ditutup
        // maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware untuk meneruskan user ke semua views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/master', isAuthenticated, isAdmin, masterRouter);  // Admin only
app.use('/users', isAuthenticated, usersRouter);            // Logged in users
app.use('/', isAuthenticated, lihatRouter);                 // Logged in users

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
