var express = require('express');
var router = express.Router();
const db = require('../../config/db'); 
const deskripsi = require('../../data/deskripsi.json');

router.get('/', function(req, res, next) {
  const query = `
    SELECT 
      objek.id,
      objek.nama_objek,
      objek.image,
      objek.kategori_id,
      kategori.nama as nama_kategori
    FROM objek 
    LEFT JOIN kategori ON objek.kategori_id = kategori.id_kategori
    ORDER BY RAND()
  `;

  db.query(query, (err, objeks) => {
    if (err) {
      console.error('Error mengambil data:', err);
      return res.status(500).render('error', {
        message: 'Gagal mengambil data',
        error: err
      });
    }

    db.query('SELECT * FROM kategori', (err, kategoris) => {
      if (err) {
        console.error('Error mengambil kategori:', err);
        return res.status(500).render('error', {
          message: 'Gagal mengambil kategori',
          error: err
        });
      }

      // Ubah render path ke index
      res.render('index', { 
        title: 'Galeri Hewan',
        objeks: objeks,
        kategoris: kategoris
      });
    });
  });
});

router.get('/detail/:id', function(req, res, next) {
  const id = req.params.id;
  
  const query = `
    SELECT 
      objek.*,
      kategori.nama as nama_kategori,
      kategori.id_kategori
    FROM objek 
    LEFT JOIN kategori ON objek.kategori_id = kategori.id_kategori
    WHERE objek.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error mengambil detail:', err);
      return res.status(500).render('error', {
        message: 'Gagal mengambil detail objek',
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(404).render('error', {
        message: 'Objek tidak ditemukan',
        error: { status: 404 }
      });
    }

    const objek = results[0];
    // Ambil deskripsi dari file JSON
    const hewanDeskripsi = deskripsi.hewan[objek.id]?.deskripsi || "Deskripsi belum tersedia";
    const kategoriDeskripsi = deskripsi.kategori[objek.id_kategori]?.deskripsi || "Deskripsi kategori belum tersedia";

    res.render('user/detail', {
      title: objek.nama_objek,
      objek: {
        ...objek,
        deskripsi: hewanDeskripsi,
        deskripsi_kategori: kategoriDeskripsi
      }
    });
  });
});

module.exports = router;