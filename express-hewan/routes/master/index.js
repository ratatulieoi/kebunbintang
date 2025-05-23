var express = require('express');
var router = express.Router();
var objekRouter = require ('./objek');
var kategoriRouter = require ('./kategori');

router.use('/objek', objekRouter);
router.use('/kategori', kategoriRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('master/index', { title: 'Halaman Admin' });
});

module.exports = router;
