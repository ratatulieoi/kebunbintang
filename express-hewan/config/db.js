const mysql = require('mysql2');

// Membuat koneksi ke database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Sesuaikan dengan username MySQL Anda
  password: '',     // Sesuaikan dengan password MySQL Anda
  database: 'haybale'
});

// Menghubungkan ke database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;