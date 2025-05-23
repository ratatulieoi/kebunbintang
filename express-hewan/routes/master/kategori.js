var express = require('express');
var router = express.Router();
const db = require('../../config/db'); 

router.get('/', function(req, res, next) {
    db.query('SELECT * from kategori', (err, result) => {
      if (err) throw err;
      res.render('master/kategori/kategori', { 
        title: 'Kategori',
        kategoris: result 
      });
    });
});

router.get('/tambah', function(req, res, next) {
    res.render('master/kategori/add_kategori', { 
      title: 'Tambah Kategori Baru'
    });
});

// Memproses form tambah kategori
router.post('/tambah', function(req, res, next) {
    const nama_kategori = req.body.nama_kategori;
    
    // Validasi input
    if (!nama_kategori) {
      return res.render('master/kategori/add_kategori', { 
        title: 'Tambah Kategori Baru',
        error: 'Nama kategori tidak boleh kosong'
      });
    }
    
    // Query untuk menyimpan data
    const query = 'INSERT INTO kategori (nama) VALUES (?)';
    
    db.query(query, [nama_kategori], (err, result) => {
      if (err) {
        console.error('Error menyimpan kategori:', err);
        return res.render('master/kategori/add_kategori', { 
          title: 'Tambah Kategori Baru',
          error: 'Gagal menyimpan kategori'
        });
      }
      
      res.redirect('/master/kategori'); 
    });
});

// Menampilkan form edit kategori
router.get('/edit/:id', function(req, res, next) {
    const id = req.params.id;
    
    // Query untuk mendapatkan data kategori yang akan diedit
    const query = 'SELECT * FROM kategori WHERE id_kategori = ?';
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error mengambil data kategori:', err);
        return res.status(500).render('error', {
          message: 'Gagal mengambil data kategori',
          error: err
        });
      }
      
      if (result.length === 0) {
        return res.status(404).render('error', {
          message: 'Kategori tidak ditemukan',
          error: { status: 404 }
        });
      }
      
      // Render form edit dengan data kategori
      res.render('master/kategori/kategori_edit', { 
        title: 'Edit Kategori',
        kategori: result[0]
      });
    });
});

// Memproses form edit kategori
router.post('/edit/:id', function(req, res, next) {
    const id = req.params.id;
    const nama_kategori = req.body.nama_kategori;
    
    // Validasi input
    if (!nama_kategori) {
      // Ambil data kategori lagi untuk ditampilkan kembali di form
      db.query('SELECT * FROM kategori WHERE id_kategori = ?', [id], (err, result) => {
        if (err || result.length === 0) {
          return res.redirect('/kategori');
        }
        
        return res.render('master/kategori/kategori_edit', { 
          title: 'Edit Kategori',
          kategori: result[0],
          error: 'Nama kategori tidak boleh kosong'
        });
      });
      return;
    }
    
    // Query untuk update data
    const query = 'UPDATE kategori SET nama = ? WHERE id_kategori = ?';
    
    db.query(query, [nama_kategori, id], (err, result) => {
      if (err) {
        console.error('Error mengupdate kategori:', err);
        return res.status(500).render('error', {
          message: 'Gagal mengupdate kategori',
          error: err
        });
      }
      
      // Redirect ke halaman daftar kategori setelah berhasil
      res.redirect('/master/kategori');
    });
});

// Route untuk menghapus kategori
router.get('/hapus/:id', function(req, res, next) {
    const id = req.params.id;
    
    // Query untuk menghapus data
    const query = 'DELETE FROM kategori WHERE id_kategori = ?';
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error menghapus kategori:', err);
        return res.status(500).render('error', {
          message: 'Gagal menghapus kategori',
          error: err
        });
      }
      
      res.redirect('/master/kategori');
    });
});

module.exports = router;
