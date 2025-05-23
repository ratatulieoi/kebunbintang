var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

// File filter untuk memastikan hanya gambar yang diupload
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Batas ukuran file 5MB
    }
});

// Menampilkan daftar objek
router.get('/', function(req, res, next) {
    const query = `
        SELECT objek.id, objek.nama_objek, objek.image, 
               objek.kategori_id, kategori.nama as nama_kategori
        FROM objek 
        LEFT JOIN kategori ON objek.kategori_id = kategori.id_kategori
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error mengambil data objek:', err);
            return res.status(500).render('error', { 
                message: 'Gagal mengambil data objek',
                error: err 
            });
        }
        
        res.render('master/objek/objek', {
            title: 'Daftar Objek',
            objeks: result 
        });
    });
});

// Menampilkan form tambah objek
router.get('/tambah', function(req, res, next) {
    db.query('SELECT * FROM kategori', (err, kategoris) => {
        if (err) {
            console.error('Error mengambil data kategori:', err);
            return res.status(500).render('error', { 
                message: 'Gagal mengambil data kategori',
                error: err 
            });
        }
        
        res.render('master/objek/objek_tambah', {
            title: 'Tambah Objek Baru',
            kategoris: kategoris
        });
    });
});

// Memproses form tambah objek
router.post('/tambah', upload.single('image'), function(req, res, next) {
    const { nama_objek, kategori_id } = req.body;
    let image = req.file ? req.file.filename : '';
    
    console.log('Form data received:', {
        nama_objek: nama_objek,
        kategori_id: kategori_id,
        image: image
    });
    
    if (!nama_objek || !kategori_id) {
        db.query('SELECT * FROM kategori', (err, kategoris) => {
            return res.render('master/objek/objek_tambah', {
                title: 'Tambah Objek Baru',
                kategoris: kategoris,
                error: 'Nama objek dan kategori harus diisi',
                objek: req.body
            });
        });
        return;
    }
    
    const query = 'INSERT INTO objek (nama_objek, kategori_id, image) VALUES (?, ?, ?)';
    
    db.query(query, [nama_objek, kategori_id, image], (err, result) => {
        if (err) {
            console.error('Error menyimpan objek:', err);
            db.query('SELECT * FROM kategori', (err, kategoris) => {
                return res.render('master/objek/objek_tambah', {
                    title: 'Tambah Objek Baru',
                    kategoris: kategoris,
                    error: 'Gagal menyimpan objek',
                    objek: req.body
                });
            });
            return;
        }
        
        res.redirect('/master/objek');
    });
});

// Menampilkan form edit objek
router.get('/edit/:id', function(req, res, next) {
    const id = req.params.id;
    
    const queryObjek = 'SELECT * FROM objek WHERE id = ?';
    
    db.query(queryObjek, [id], (err, objek) => {
        if (err) {
            console.error('Error mengambil data objek:', err);
            return res.status(500).render('error', {
                message: 'Gagal mengambil data objek',
                error: err
            });
        }

        if (objek.length === 0) {
            return res.status(404).render('error', {
                message: 'Objek tidak ditemukan',
                error: { status: 404 }
            });
        }

        db.query('SELECT * FROM kategori', (err, kategoris) => {
            if (err) {
                console.error('Error mengambil data kategori:', err);
                return res.status(500).render('error', {
                    message: 'Gagal mengambil data kategori',
                    error: err
                });
            }
            
            res.render('master/objek/objek_edit', {
                title: 'Edit Objek',
                objek: objek[0],
                kategoris: kategoris
            });
        });
    });
});

// Memproses form edit objek
router.post('/edit/:id', upload.single('image'), function(req, res, next) {
    const id = req.params.id;
    const { nama_objek, kategori_id } = req.body;
    let image = req.file ? req.file.filename : req.body.old_image;
    
    if (!nama_objek || !kategori_id) {
        db.query('SELECT * FROM kategori', (err, kategoris) => {
            return res.render('master/objek/objek_edit', {
                title: 'Edit Objek',
                objek: { ...req.body, id },
                kategoris: kategoris,
                error: 'Nama objek dan kategori harus diisi'
            });
        });
        return;
    }
    
    const query = 'UPDATE objek SET nama_objek = ?, kategori_id = ?, image = ? WHERE id = ?';
    
    db.query(query, [nama_objek, kategori_id, image, id], (err, result) => {
        if (err) {
            console.error('Error mengupdate objek:', err);
            db.query('SELECT * FROM kategori', (err, kategoris) => {
                return res.render('master/objek/objek_edit', {
                    title: 'Edit Objek',
                    objek: { ...req.body, id },
                    kategoris: kategoris,
                    error: 'Gagal mengupdate objek'
                });
            });
            return;
        }
        
        res.redirect('/master/objek');
    });
});

// Menghapus objek
router.get('/hapus/:id', function(req, res, next) {
    const id = req.params.id;
    const query = 'DELETE FROM objek WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error menghapus objek:', err);
            return res.status(500).render('error', {
                message: 'Gagal menghapus objek',
                error: err
            });
        }
        
        res.redirect('/master/objek');
    });
});

module.exports = router;